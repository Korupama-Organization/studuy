import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GlobalHeader from "../../components/GlobalHeader";
import { getStoredUser } from "../../services/auth";
import {
  extractCandidateApplications,
  normalizeCandidateApplication,
  type CandidateApplicationCard,
} from "./candidateApplications";
import "./candidateJobs.css";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getCandidateUserId = (): string => {
  return getStoredUser()?._id || "";
};

const getResponseErrorMessage = async (response: Response, fallback = "Không thể tải danh sách ứng tuyển."): Promise<string> => {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return fallback;
    }

    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || fallback;
  } catch {
    return fallback;
  }
};

const readJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Không thể tải danh sách ứng tuyển.");
  }

  return response.json() as Promise<unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (isRecord(value)) {
      const objectId = value.$oid;
      if (typeof objectId === "string" && objectId.trim()) {
        return objectId.trim();
      }
    }
  }

  return "";
};

const getNestedRecord = (record: Record<string, unknown>, key: string): Record<string, unknown> => {
  const value = record[key];
  return isRecord(value) ? value : {};
};

const extractJobs = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.jobs)) {
    return payload.jobs.filter(isRecord);
  }

  if (Array.isArray(payload.data)) {
    return payload.data.filter(isRecord);
  }

  const data = getNestedRecord(payload, "data");
  if (Array.isArray(data.jobs)) {
    return data.jobs.filter(isRecord);
  }

  return [];
};

const buildJobCreatedDateMap = (jobs: Record<string, unknown>[]): Map<string, string> => {
  const jobCreatedDates = new Map<string, string>();

  jobs.forEach((job) => {
    const jobId = getString(job._id, job.id, job.jobId);
    const createdDate = getString(job.createdDate, job.createdAt, job.created_date);

    if (jobId && createdDate) {
      jobCreatedDates.set(jobId, createdDate);
    }
  });

  return jobCreatedDates;
};

const buildJobCompanyIdMap = (jobs: Record<string, unknown>[]): Map<string, string> => {
  const jobCompanyIds = new Map<string, string>();

  jobs.forEach((job) => {
    const jobCompanyId = getNestedRecord(job, "companyId");
    const company = getNestedRecord(job, "company");
    const jobId = getString(job._id, job.id, job.jobId);
    const companyId = getString(
      job.companyId,
      jobCompanyId._id,
      jobCompanyId.id,
      company._id,
      company.id,
      company.companyId,
    );

    if (jobId && companyId) {
      jobCompanyIds.set(jobId, companyId);
    }
  });

  return jobCompanyIds;
};

const recordMatchesCompanyId = (record: Record<string, unknown>, companyId: string): boolean => {
  if (!companyId) {
    return true;
  }

  const nestedCompanyId = getNestedRecord(record, "companyId");
  const recordCompanyId = getString(record._id, record.id, record.companyId, nestedCompanyId._id, nestedCompanyId.id);

  return recordCompanyId === companyId;
};

const getMatchedDescription = (record: Record<string, unknown>, companyId: string): string => {
  return recordMatchesCompanyId(record, companyId) ? getString(record.description) : "";
};

const extractCompanyDescription = (payload: unknown, companyId = ""): string => {
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const description = extractCompanyDescription(item, companyId);
      if (description) {
        return description;
      }
    }
  }

  if (!isRecord(payload)) {
    return "";
  }

  const company = getNestedRecord(payload, "company");
  const data = getNestedRecord(payload, "data");
  const dataCompany = getNestedRecord(data, "company");
  const profile = getNestedRecord(payload, "profile");
  const companyProfile = getNestedRecord(payload, "companyProfile");

  const directDescription = getString(
    getMatchedDescription(company, companyId),
    getMatchedDescription(dataCompany, companyId),
    getMatchedDescription(profile, companyId),
    getMatchedDescription(companyProfile, companyId),
    getMatchedDescription(data, companyId),
    getMatchedDescription(payload, companyId),
  );

  if (directDescription) {
    return directDescription;
  }

  for (const value of Object.values(payload)) {
    const description = extractCompanyDescription(value, companyId);
    if (description) {
      return description;
    }
  }

  return "";
};

const fetchCompanyDescriptions = async (companyIds: string[]): Promise<Map<string, string>> => {
  const descriptions = new Map<string, string>();

  await Promise.all(
    companyIds.map(async (companyId) => {
      try {
        const response = await fetch(`/api/companies/?companyId=${encodeURIComponent(companyId)}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          return;
        }

        const payload = await readJsonResponse(response);
        const description = extractCompanyDescription(payload, companyId);

        if (description) {
          descriptions.set(companyId, description);
        }
      } catch {
        // Keep the per-application fallback when company lookup is unavailable.
      }
    }),
  );

  return descriptions;
};

const formatLogTime = (value: string): string => {
  if (!value) {
    return "Chưa có thời gian log.";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function ProcessBars({ application }: { application: CandidateApplicationCard }) {
  return (
    <div className="candidate-job-process" aria-label={`Tiến trình ứng tuyển: ${application.status}`}>
      {application.processLabels.map((label, index) => {
        const isActive = index === application.currentProcessIndex;
        const isDone = index < application.currentProcessIndex;

        return (
          <div
            className={`candidate-job-process__bar${isActive ? " candidate-job-process__bar--active" : ""}${
              isDone ? " candidate-job-process__bar--done" : ""
            }`}
            key={label}
          >
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function InfoPanel({ title, content, onOpen }: { title: string; content: string; onOpen: () => void }) {
  return (
    <section className="candidate-job-info-panel" aria-label={title}>
      <span className="candidate-job-info-panel__accent" />
      <h3>{title}</h3>
      <p>{content}</p>
      <button className="candidate-job-info-panel__read-more" type="button" onClick={onOpen}>
        Xem chi tiết
      </button>
    </section>
  );
}

function DetailDialog({
  title,
  content,
  onClose,
}: {
  title: string;
  content: string;
  onClose: () => void;
}) {
  return (
    <div className="candidate-job-dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="candidate-job-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-job-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="candidate-job-dialog__header">
          <h2 id="candidate-job-dialog-title">{title}</h2>
          <button className="candidate-job-dialog__close" type="button" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>
        <div className="candidate-job-dialog__content">
          <p>{content}</p>
        </div>
      </section>
    </div>
  );
}

function CandidateJobCard({
  application,
  isApplying,
  onApply,
}: {
  application: CandidateApplicationCard;
  isApplying: boolean;
  onApply: (application: CandidateApplicationCard) => void;
}) {
  const [dialogContent, setDialogContent] = useState<{ title: string; content: string } | null>(null);
  const initials = useMemo(() => {
    return application.companyName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [application.companyName]);

  return (
    <article className="candidate-job-card">
      <div className="candidate-job-card__main">
        <div className="candidate-job-company">
          <div className="candidate-job-company__logo">
            {application.logoUrl ? <img src={application.logoUrl} alt={application.companyName} /> : <span>{initials}</span>}
          </div>
          <h2>{application.companyName}</h2>
          <p className="candidate-job-company__detail">{application.companyDetail}</p>
          <h3>{application.jobTitle}</h3>
          <p className="candidate-job-company__location">{application.location}</p>
          <button
            className="candidate-job-apply"
            type="button"
            onClick={() => onApply(application)}
            disabled={isApplying || !application.jobId}
          >
            {isApplying ? "Đang apply..." : "Apply"}
          </button>
        </div>

        <ProcessBars application={application} />

        <div className="candidate-job-description" aria-label="Ghi chú giai đoạn">
          <span className="candidate-job-description__marker candidate-job-description__marker--top" />
          <span className="candidate-job-description__marker candidate-job-description__marker--middle" />
          <div className="candidate-job-stage-note">
            <span className="candidate-job-stage-note__label">{application.currentStageLabel}</span>
            <p>{application.currentStageNote}</p>
            <div className="candidate-job-stage-note__meta">
              <span>Ngày tạo tin</span>
              <time dateTime={application.currentStageLoggedAt || undefined}>
                {formatLogTime(application.currentStageLoggedAt)}
              </time>
            </div>
          </div>
        </div>
      </div>

      <aside className="candidate-job-card__side">
        <h2>Giới thiệu</h2>
        <InfoPanel
          title="Về công ty"
          content={application.companyDescription}
          onOpen={() => setDialogContent({ title: "Về công ty", content: application.companyDescription })}
        />
        <InfoPanel
          title="Mô tả công việc"
          content={application.jobDescription}
          onOpen={() => setDialogContent({ title: "Mô tả công việc", content: application.jobDescription })}
        />
      </aside>

      {dialogContent ? (
        <DetailDialog title={dialogContent.title} content={dialogContent.content} onClose={() => setDialogContent(null)} />
      ) : null}
    </article>
  );
}

export default function CandidateJobsPage() {
  const queryClient = useQueryClient();
  const [applyMessage, setApplyMessage] = useState("");
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["candidate-applications"],
    queryFn: async () => {
      const response = await fetch("/api/applications", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await readJsonResponse(response);
      const applications = extractCandidateApplications(payload).map(normalizeCandidateApplication);
      const jobIds = new Set(applications.map((application) => application.jobId).filter(Boolean));

      if (jobIds.size === 0) {
        const companyIds = [...new Set(applications.map((application) => application.companyId).filter(Boolean))];
        const companyDescriptions = companyIds.length > 0 ? await fetchCompanyDescriptions(companyIds) : new Map<string, string>();

        return applications.map((application) => ({
          ...application,
          companyDescription: companyDescriptions.get(application.companyId) || application.companyDescription,
        }));
      }

      try {
        const jobsResponse = await fetch("/api/jobs", {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!jobsResponse.ok) {
          const companyIds = [...new Set(applications.map((application) => application.companyId).filter(Boolean))];
          const companyDescriptions = companyIds.length > 0 ? await fetchCompanyDescriptions(companyIds) : new Map<string, string>();

          return applications.map((application) => ({
            ...application,
            companyDescription: companyDescriptions.get(application.companyId) || application.companyDescription,
          }));
        }

        const jobsPayload = await readJsonResponse(jobsResponse);
        const jobs = extractJobs(jobsPayload);
        const jobCreatedDates = buildJobCreatedDateMap(jobs);
        const jobCompanyIds = buildJobCompanyIdMap(jobs);
        const resolvedApplications = applications.map((application) => ({
          ...application,
          companyId: jobCompanyIds.get(application.jobId) || application.companyId,
        }));
        const companyIds = [...new Set(resolvedApplications.map((application) => application.companyId).filter(Boolean))];
        const companyDescriptions = companyIds.length > 0 ? await fetchCompanyDescriptions(companyIds) : new Map<string, string>();

        return resolvedApplications.map((application) => ({
          ...application,
          companyDescription: companyDescriptions.get(application.companyId) || application.companyDescription,
          currentStageLoggedAt: jobCreatedDates.get(application.jobId) || application.currentStageLoggedAt,
        }));
      } catch {
        const companyIds = [...new Set(applications.map((application) => application.companyId).filter(Boolean))];
        const companyDescriptions = companyIds.length > 0 ? await fetchCompanyDescriptions(companyIds) : new Map<string, string>();

        return applications.map((application) => ({
          ...application,
          companyDescription: companyDescriptions.get(application.companyId) || application.companyDescription,
        }));
      }
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (application: CandidateApplicationCard) => {
      if (!application.jobId) {
        throw new Error("Không tìm thấy mã job để ứng tuyển.");
      }

      const candidateUserId = getCandidateUserId();
      if (!candidateUserId) {
        throw new Error("Không tìm thấy tài khoản candidate để ứng tuyển.");
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          jobId: application.jobId,
          candidateUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response, "Ứng tuyển thất bại."));
      }
    },
    onMutate: (application) => {
      setApplyMessage("");
      setApplyingJobId(application.jobId);
    },
    onSuccess: async () => {
      setApplyMessage("Ứng tuyển thành công.");
      await queryClient.invalidateQueries({ queryKey: ["candidate-applications"] });
    },
    onError: (mutationError) => {
      setApplyMessage(mutationError instanceof Error ? mutationError.message : "Ứng tuyển thất bại.");
    },
    onSettled: () => {
      setApplyingJobId(null);
    },
  });

  const applications = data ?? [];
  const errorMessage = error instanceof Error ? error.message : "";

  return (
    <div className="candidate-jobs-page">
      <GlobalHeader />

      <main className="candidate-jobs-main">
        <div className="candidate-jobs-shell">
          <h1>Tìm kiếm việc làm</h1>

          {isLoading ? <p className="candidate-jobs-loading">Đang tải danh sách ứng tuyển...</p> : null}
          {errorMessage ? <p className="candidate-jobs-notice">{errorMessage}</p> : null}
          {applyMessage ? <p className="candidate-jobs-notice">{applyMessage}</p> : null}

          {!isLoading && !errorMessage && applications.length === 0 ? (
            <div className="candidate-jobs-empty">
              <h2>Chưa có application nào</h2>
              <p>Khi bạn ứng tuyển, trạng thái application sẽ hiển thị tại đây.</p>
            </div>
          ) : null}

          {applications.length > 0 ? (
            <div className="candidate-jobs-list">
              {applications.map((application) => (
                <CandidateJobCard
                  key={application.id}
                  application={application}
                  isApplying={applyMutation.isPending && applyingJobId === application.jobId}
                  onApply={(selectedApplication) => applyMutation.mutate(selectedApplication)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
