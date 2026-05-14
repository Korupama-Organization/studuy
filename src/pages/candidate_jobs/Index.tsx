import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import GlobalHeader from "../../components/GlobalHeader";
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

const getResponseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return "Không thể tải danh sách ứng tuyển.";
    }

    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || "Không thể tải danh sách ứng tuyển.";
  } catch {
    return "Không thể tải danh sách ứng tuyển.";
  }
};

const readJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error("Không thể tải danh sách ứng tuyển.");
  }

  return response.json() as Promise<unknown>;
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

function InfoPanel({ title, content }: { title: string; content: string }) {
  return (
    <section className="candidate-job-info-panel" aria-label={title}>
      <span className="candidate-job-info-panel__accent" />
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

function CandidateJobCard({ application }: { application: CandidateApplicationCard }) {
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
        </div>

        <ProcessBars application={application} />

        <div className="candidate-job-description" aria-label="Mô tả nhanh">
          <span className="candidate-job-description__marker candidate-job-description__marker--top" />
          <span className="candidate-job-description__marker candidate-job-description__marker--middle" />
          <p>{application.summary}</p>
        </div>
      </div>

      <aside className="candidate-job-card__side">
        <h2>Giới thiệu</h2>
        <InfoPanel title="Mô tả công việc" content={application.summary} />
        <InfoPanel title="Yêu cầu" content={application.requirements} />
      </aside>
    </article>
  );
}

export default function CandidateJobsPage() {
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
      return extractCandidateApplications(payload).map(normalizeCandidateApplication);
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

          {!isLoading && !errorMessage && applications.length === 0 ? (
            <div className="candidate-jobs-empty">
              <h2>Chưa có application nào</h2>
              <p>Khi bạn ứng tuyển, trạng thái application sẽ hiển thị tại đây.</p>
            </div>
          ) : null}

          {applications.length > 0 ? (
            <div className="candidate-jobs-list">
              {applications.map((application) => (
                <CandidateJobCard key={application.id} application={application} />
              ))}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
