import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CandidateJobsHeader from "./CandidateJobsHeader";
import {
  extractCandidateApplications,
  mockCandidateApplications,
  normalizeCandidateApplication,
  type CandidateApplicationCard,
} from "./candidateApplications";
import "./candidateJobs.css";

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");

const buildApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";

  return token ? { Authorization: `Bearer ${token}` } : {};
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
      const response = await fetch(buildApiUrl("/api/applications"), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách ứng tuyển.");
      }

      const payload = (await response.json()) as unknown;
      return extractCandidateApplications(payload).map(normalizeCandidateApplication);
    },
  });

  const applications = data && data.length > 0 ? data : mockCandidateApplications;
  const notice =
    error instanceof Error
      ? `${error.message} Đang hiển thị dữ liệu mẫu.`
      : data && data.length === 0
        ? "Chưa có dữ liệu ứng tuyển từ API, đang hiển thị dữ liệu mẫu."
        : "";

  return (
    <div className="candidate-jobs-page">
      <CandidateJobsHeader />

      <main className="candidate-jobs-main">
        <div className="candidate-jobs-shell">
          <h1>Tìm kiếm việc làm</h1>

          {notice ? <p className="candidate-jobs-notice">{notice}</p> : null}
          {isLoading ? <p className="candidate-jobs-loading">Đang tải danh sách ứng tuyển...</p> : null}

          <div className="candidate-jobs-list">
            {applications.map((application) => (
              <CandidateJobCard key={application.id} application={application} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
