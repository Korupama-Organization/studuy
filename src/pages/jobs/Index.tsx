import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import JobsTable from "./components/JobsTable";
import Pagination from "./components/Pagination";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  salary: string;
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
  salary?: string;
  client?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() || "http://localhost:3000";

const PAGE_SIZE = 6;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";

  if (!token) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
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

const normalizeJob = (raw: Record<string, unknown>): JobRow => {
  const basicInfo = raw.basicInfo as Record<string, unknown> | undefined;
  const company = raw.company as Record<string, unknown> | undefined;

  const creator = raw.createdBy as Record<string, unknown> | string | undefined;
  const createdBy =
    (typeof company?.name === "string" && company.name) ||
    (typeof raw.companyName === "string" && raw.companyName) ||
    (typeof creator === "object" && creator && typeof creator.companyName === "string" && creator.companyName) ||
    "-";

  return {
    id:
      (typeof raw._id === "string" && raw._id) ||
      (typeof raw.id === "string" && raw.id) ||
      "N/A",
    slug:
      (typeof raw.slug === "string" && raw.slug) ||
      (typeof raw.jobSlug === "string" && raw.jobSlug) ||
      "",
    title:
      (typeof basicInfo?.title === "string" && basicInfo.title) ||
      (typeof raw.jobTitle === "string" && raw.jobTitle) ||
      (typeof raw.title === "string" && raw.title) ||
      "-",
    salary:
      (typeof raw.salary === "string" && raw.salary) ||
      (typeof raw.salaryRange === "string" && raw.salaryRange) ||
      "-",
    createdAt: parseDate(raw.createdAt),
    createdBy,
    status: (typeof raw.status === "string" && raw.status) || "Opening",
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

const getResponseErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        throw new Error("Khong the tai danh sach jobs.");
      }

      setJobs(extractJobs(payload).map(normalizeJob));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Khong the tai danh sach jobs.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

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

  const handleCreateJob = useCallback(
    async (payload: SaveJobPayload) => {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Tao job that bai."));
      }

      await loadJobs();
      setCurrentPage(1);
    },
    [loadJobs],
  );

  const handleUpdateJob = useCallback(
    async (id: string, payload: SaveJobPayload) => {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Cap nhat job that bai."));
      }

      await loadJobs();
    },
    [loadJobs],
  );

  const handleDeleteJob = useCallback(
    async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Xoa job that bai."));
      }

      await loadJobs();
    },
    [loadJobs],
  );

  return (
    <div className="min-h-dvh bg-[#F4F6FB] text-slate-900 font-['Inter']">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E8E9FF] blur-[90px]"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#EDEEFF] blur-[120px]"></div>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px] gap-5 px-4 py-6 lg:px-6">
        <Sidebar />

        <main className="flex flex-1 flex-col gap-6">
          <TopHeader onCreateJob={handleCreateJob} />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <JobsTable
            jobs={pagedJobs}
            isLoading={isLoading}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
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
