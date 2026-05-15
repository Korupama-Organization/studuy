import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";
import TopHeader from "./components/TopHeader";
import JobsTable from "./components/JobsTable";
import Pagination from "./components/Pagination";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  shortDescription?: string;
  jobDescription?: string;
  locations: string[];
  workModel: string;
  level: string;
  jobType: string;
  headcount: number;
  roleType: string;
  requiredEducation: string;
  minMonthsExperience: number;
  skills: string[];
  createdAt: string;
  createdBy: string;
  status: string;
}

export interface SaveJobPayload {
  jobTitle: string;
  jobDescription: string;
  shortDescription: string;
  location?: string;
  requiredEducation?: string;
  workModel?: string;
  level?: string;
  jobType?: string;
  headcount?: number;
  roleType?: string;
  minMonthsExperience?: number;
  requiredSkills?: string[];
  preferredSkills?: string[];
  minGpa?: number;
  requiredLanguages?: string[];
  portfolioExpected?: string;
}

const PAGE_SIZE = 6;

const getAuthHeaders = (includeJsonContentType = true): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  const headers: Record<string, string> = {};

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (!token) {
    return headers;
  }

  headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseDate = (value: unknown): string => {
  if (typeof value !== "string" || !value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("vi-VN");
};

const normalizeSkillNames = (skills: unknown): string[] => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const uniqueSkills = new Set<string>();

  skills.forEach((skill) => {
    const skillName =
      typeof skill === "string"
        ? skill
        : skill && typeof skill === "object" && typeof (skill as Record<string, unknown>).name === "string"
          ? ((skill as Record<string, unknown>).name as string)
          : "";
    const normalized = skillName.trim().replace(/\s+/g, " ");

    if (normalized) {
      uniqueSkills.add(normalized);
    }
  });

  return [...uniqueSkills];
};

const normalizeLocations = (location: unknown): string[] => {
  if (Array.isArray(location)) {
    return location
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().replace(/\s+/g, " "))
      .filter(Boolean);
  }

  if (typeof location !== "string") {
    return [];
  }

  return location
    .split(",")
    .map((item) => item.trim().replace(/\s+/g, " "))
    .filter(Boolean);
};

const normalizeTextList = (items: unknown): string[] => normalizeLocations(items);

const normalizeOptionalText = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() ? value.trim().replace(/\s+/g, " ") : fallback;

const normalizeJob = (raw: Record<string, unknown>): JobRow => {
  const basicInfo = raw.basicInfo as Record<string, unknown> | undefined;
  const requirements = raw.requirements as Record<string, unknown> | undefined;
  const company = raw.company as Record<string, unknown> | undefined;

  const createdBy =
    (typeof company?.name === "string" && company.name) ||
    (typeof raw.companyName === "string" && raw.companyName) ||
    "-";

  const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }

    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }

    return [];
  };

  const locationsFromBasicInfo = toStringArray(basicInfo?.locations);
  const locationsFromBasicInfoSingle = toStringArray(basicInfo?.location);
  const locationsFromRoot = toStringArray(raw.locations);
  const locationsFromRootSingle = toStringArray(raw.location);

  const locations =
    locationsFromBasicInfo.length > 0
      ? locationsFromBasicInfo
      : locationsFromBasicInfoSingle.length > 0
        ? locationsFromBasicInfoSingle
        : locationsFromRoot.length > 0
          ? locationsFromRoot
          : locationsFromRootSingle;

  const parseDateField = (dateVal: unknown): string => {
    if (!dateVal) return "-";
    if (typeof dateVal === "string") {
      return parseDate(dateVal);
    }
    if (typeof dateVal === "object" && dateVal !== null) {
      const dateObj = dateVal as Record<string, unknown>;
      if (typeof dateObj.$date === "string") {
        return parseDate(dateObj.$date);
      }
    }
    return "-";
  };

  const rawId =
    (typeof raw._id === "string" && raw._id) ||
    (typeof raw.id === "string" && raw.id) ||
    "";
  return {
    id: rawId || "N/A",
    slug: rawId ? `JOB-${rawId.slice(-5).toUpperCase()}` : "",
    title:
      (typeof basicInfo?.title === "string" && basicInfo.title) ||
      "-",
    summary:
      (typeof basicInfo?.summary === "string" && basicInfo.summary) ||
      "",
    shortDescription:
      (typeof basicInfo?.shortDescription === "string" && basicInfo.shortDescription) ||
      undefined,
    jobDescription:
      (typeof basicInfo?.jobDescription === "string" && basicInfo.jobDescription) ||
      undefined,
    locations,
    workModel:
      (typeof basicInfo?.workModel === "string" && basicInfo.workModel) ||
      (typeof basicInfo?.workmodel === "string" && basicInfo.workmodel) ||
      (typeof raw.workModel === "string" && raw.workModel) ||
      (typeof raw.workmodel === "string" && raw.workmodel) ||
      "",
    level:
      (typeof basicInfo?.level === "string" && basicInfo.level) ||
      (typeof basicInfo?.jobLevel === "string" && basicInfo.jobLevel) ||
      (typeof raw.level === "string" && raw.level) ||
      (typeof raw.jobLevel === "string" && raw.jobLevel) ||
      "",
    jobType:
      (typeof basicInfo?.jobType === "string" && basicInfo.jobType) ||
      (typeof basicInfo?.jobtype === "string" && basicInfo.jobtype) ||
      (typeof raw.jobType === "string" && raw.jobType) ||
      (typeof raw.jobtype === "string" && raw.jobtype) ||
      "",
    headcount: (() => {
      const headCountCandidates: unknown[] = [
        basicInfo?.headCount,
        basicInfo?.headcount,
        raw.headCount,
        raw.headcount,
      ];

      for (const candidate of headCountCandidates) {
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
          return candidate;
        }
        if (typeof candidate === "string" && candidate.trim()) {
          const parsed = Number(candidate);
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }
      }

      return 0;
    })(),
    roleType:
      (typeof basicInfo?.roleType === "string" && basicInfo.roleType) ||
      "",
    requiredEducation:
      (typeof requirements?.requiredEducation === "string" &&
        requirements.requiredEducation) ||
      "",
    minMonthsExperience: (() => {
      const monthCandidates: unknown[] = [
        requirements?.minMonthsExperience,
        requirements?.minimumMonthsExperience,
        requirements?.monthsExperience,
        raw.minMonthsExperience,
        raw.minimumMonthsExperience,
      ];

      for (const candidate of monthCandidates) {
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
          return candidate;
        }
        if (typeof candidate === "string" && candidate.trim()) {
          const parsed = Number(candidate);
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }
      }

      const yearCandidates: unknown[] = [
        requirements?.minYearsExperience,
        requirements?.minimumYearsExperience,
        raw.minYearsExperience,
      ];

      for (const candidate of yearCandidates) {
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
          return candidate * 12;
        }
        if (typeof candidate === "string" && candidate.trim()) {
          const parsed = Number(candidate);
          if (!Number.isNaN(parsed)) {
            return parsed * 12;
          }
        }
      }

      return 0;
    })(),
    skills: normalizeSkillNames(
      Array.isArray(requirements?.requiredSkills)
        ? requirements.requiredSkills
        : requirements?.skills,
    ),
    createdAt: parseDateField(raw.createdAt),
    createdBy,
    status: (typeof raw.status === "string" && raw.status) || "Đang tuyển",
  };
};

const extractJobs = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;

    if (Array.isArray(objectPayload.jobs)) {
      return objectPayload.jobs as Record<string, unknown>[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as Record<string, unknown>[];
    }

    if (objectPayload.data && typeof objectPayload.data === "object") {
      const nestedData = objectPayload.data as Record<string, unknown>;
      if (Array.isArray(nestedData.jobs)) {
        return nestedData.jobs as Record<string, unknown>[];
      }
    }
  }

  return [];
};

const extractObjectPayload = (payload: unknown): Record<string, unknown> | null => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const objectPayload = payload as Record<string, unknown>;
  if (objectPayload.data && typeof objectPayload.data === "object" && !Array.isArray(objectPayload.data)) {
    return objectPayload.data as Record<string, unknown>;
  }

  return objectPayload;
};

const getStringId = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    if (typeof objectValue.$oid === "string" && objectValue.$oid.trim()) {
      return objectValue.$oid.trim();
    }
  }

  return "";
};

const extractCreatedJobId = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const objectPayload = payload as Record<string, unknown>;
  const directId =
    getStringId(objectPayload._id) ||
    getStringId(objectPayload.id) ||
    getStringId(objectPayload.jobId);

  if (directId) {
    return directId;
  }

  const nestedKeys = ["data", "job", "createdJob", "result", "payload", "item"];
  for (const key of nestedKeys) {
    const nestedId = extractCreatedJobId(objectPayload[key]);
    if (nestedId) {
      return nestedId;
    }
  }

  return "";
};

const getResponseErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  const statusPart = response.status ? ` (${response.status}${response.statusText ? ` ${response.statusText}` : ""})` : "";

  try {
    const rawBody = (await response.text()).trim();

    if (!rawBody) {
      return `${fallback}${statusPart}`;
    }

    let payload: { message?: string | string[]; error?: string | string[] };
    try {
      payload = JSON.parse(rawBody) as { message?: string | string[]; error?: string | string[] };
    } catch {
      return rawBody;
    }

    const message = Array.isArray(payload.message)
      ? payload.message.find((item) => typeof item === "string" && item.trim())
      : payload.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    const error = Array.isArray(payload.error)
      ? payload.error.find((item) => typeof item === "string" && item.trim())
      : payload.error;

    if (typeof error === "string" && error.trim()) {
      return error;
    }
  } catch {
    return `${fallback}${statusPart}`;
  }

  return `${fallback}${statusPart}`;
};

export default function RecruiterJobsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const fetchJobDetail = useCallback(async (id: string): Promise<JobRow | null> => {
    try {
      const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as unknown;
      const detailPayload = extractObjectPayload(payload);

      return detailPayload ? normalizeJob(detailPayload) : null;
    } catch {
      return null;
    }
  }, []);

  const loadJobs = useCallback(async (sort: "newest" | "oldest" = "newest") => {
    setIsLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        sort,
        limit: "100",
      });

      const response = await fetch(`/api/jobs?${query.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error("Không thể tải danh sách việc làm.");
      }

      const listJobs = extractJobs(payload).map(normalizeJob);
      const enrichedJobs = await Promise.all(listJobs.map(async (job) => {
        if (!job.id || job.id === "N/A") {
          return job;
        }

        const detailJob = await fetchJobDetail(job.id);
        return detailJob
          ? {
              ...job,
              ...detailJob,
              slug: job.slug || detailJob.slug,
              status: detailJob.status || job.status,
              createdAt: detailJob.createdAt || job.createdAt,
            }
          : job;
      }));

      setJobs(enrichedJobs);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách việc làm.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchJobDetail]);

  useEffect(() => {
    void loadJobs(sortBy);
  }, [loadJobs, sortBy]);

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return jobs.slice(start, start + PAGE_SIZE);
  }, [currentPage, jobs]);

  const handleSortChange = useCallback((newSort: "newest" | "oldest") => {
    setSortBy(newSort);
  }, []);

  const toNestedPayload = (flat: SaveJobPayload) => {
    const normalizedRequiredSkills = normalizeSkillNames(flat.requiredSkills);
    const normalizedPreferredSkills = normalizeSkillNames(flat.preferredSkills);
    const normalizedRequiredLanguages = normalizeTextList(flat.requiredLanguages);

    return {
      basicInfo: {
        title: flat.jobTitle,
        summary: flat.shortDescription,
        jobDescription: flat.jobDescription,
        locations: normalizeLocations(flat.location),
        workModel: flat.workModel || "",
        level: flat.level || "",
        jobType: flat.jobType || "",
        headcount: flat.headcount ?? 0,
        roleType: flat.roleType || "",
      },
      requirements: {
        requiredSkills: normalizedRequiredSkills,
        preferredSkills: normalizedPreferredSkills.length ? normalizedPreferredSkills : normalizedRequiredSkills,
        requiredEducation: flat.requiredEducation || "",
        minGpa: flat.minGpa ?? 0,
        requiredLanguages: normalizedRequiredLanguages.length ? normalizedRequiredLanguages : ["Không yêu cầu"],
        minMonthsExperience: flat.minMonthsExperience ?? 0,
        portfolioExpected: normalizeOptionalText(flat.portfolioExpected, "Không yêu cầu"),
      },
    };
  };

  const handleCreateJob = useCallback(
    async (payload: SaveJobPayload) => {
      const nestedPayload = toNestedPayload(payload);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(nestedPayload),
      });

      if (!response.ok) {
        const message = await getResponseErrorMessage(response, "Tạo việc làm thất bại.");
        const diagnostic = {
          status: response.status,
          statusText: response.statusText,
          payload: nestedPayload,
          message,
        };
        console.error(`Create job failed: ${JSON.stringify(diagnostic, null, 2)}`);
        throw new Error(`Tạo việc làm thất bại (${response.status}${response.statusText ? ` ${response.statusText}` : ""}): ${message}`);
      }

      const createPayload = (await response.json().catch(() => null)) as unknown;
      const createdJobId = extractCreatedJobId(createPayload);

      if (!createdJobId) {
        throw new Error("Tạo việc làm thành công nhưng không nhận được mã job để publish.");
      }

      const publishResponse = await fetch(`/api/jobs/${encodeURIComponent(createdJobId)}/publish`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!publishResponse.ok) {
        throw new Error(await getResponseErrorMessage(publishResponse, "Publish việc làm thất bại."));
      }

      await loadJobs(sortBy);
      setCurrentPage(1);
    },
    [loadJobs, sortBy],
  );

  const handleUpdateJob = useCallback(
    async (id: string, payload: SaveJobPayload) => {
      const nestedPayload = toNestedPayload(payload);

      const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(nestedPayload),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Cập nhật việc làm thất bại."));
      }

      await loadJobs(sortBy);
    },
    [loadJobs, sortBy],
  );

  const handleDeleteJob = useCallback(
    async (id: string) => {
      const closeResponse = await fetch(`/api/jobs/${encodeURIComponent(id)}/close`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!closeResponse.ok) {
        throw new Error(await getResponseErrorMessage(closeResponse, "Đóng việc làm thất bại."));
      }

      const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Xóa việc làm thất bại."));
      }

      await loadJobs();
    },
    [loadJobs],
  );

  const handleViewApplicants = useCallback(
    (job: JobRow) => {
      const params = new URLSearchParams();
      params.set("jobId", job.id);
      if (job.title) {
        params.set("jobTitle", job.title);
      }
      navigate(`/recruiter/candidates?${params.toString()}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-dvh bg-[#F4F6FB] text-slate-900 font-['Inter']">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E8E9FF] blur-[90px]"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#EDEEFF] blur-[120px]"></div>
      </div>

      <div className="relative flex min-h-dvh w-full gap-5 pr-4 lg:pr-6">
        <RecruiterSidebar activePath="/recruiter/jobs" />

        <main className="flex flex-1 flex-col gap-6 pt-6">
          <TopHeader onCreateJob={handleCreateJob} onSortChange={handleSortChange} />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <JobsTable
            jobs={pagedJobs}
            isLoading={isLoading}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onViewApplicants={handleViewApplicants}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
}
