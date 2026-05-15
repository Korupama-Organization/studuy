import React from "react";
import { Link } from "react-router-dom";

interface JobMatch {
  jobId: string;
  title: string;
  company: {
    name: string;
    logoUrl: string | null;
  };
  location: string;
  matchScore: number;
  workModel?: string;
  jobType?: string;
}

interface JobMatchesSectionProps {
  jobs: JobMatch[];
  firstName: string;
  overallScore: number;
}

const getMatchClass = (score: number) => {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
};

const JobMatchesSection: React.FC<JobMatchesSectionProps> = ({ jobs, firstName, overallScore }) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">Việc làm phù hợp cho {firstName}</h2>
        <Link to="/jobs" className="view-all-link">
          Xem tất cả{" "}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="job-matches-grid">
        {/* Job cards */}
        <div className="job-cards-list">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.jobId} className="job-card">
                {/* Company logo */}
                <div className="job-logo">
                  {job.company.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "0.5rem" }}
                    />
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="job-info">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                    <h3 className="job-title">{job.title}</h3>
                    {job.matchScore > 0 && (
                      <span className={`match-score-badge ${getMatchClass(job.matchScore)}`}>
                        {job.matchScore}% phù hợp
                      </span>
                    )}
                  </div>
                  <p className="job-company">{job.company.name}</p>
                  <div className="job-meta">
                    {job.location && (
                      <span className="job-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {job.location}
                      </span>
                    )}
                    {job.workModel && (
                      <span className="job-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                        {job.workModel}
                      </span>
                    )}
                  </div>
                  <div className="job-actions">
                    <button className="btn-primary">Ứng tuyển ngay</button>
                    <button className="btn-outline">Lưu</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="job-card"
              style={{ justifyContent: "center", color: "#94a3b8", fontSize: "0.9rem", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.75rem", padding: "2rem" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p style={{ margin: 0 }}>
                Chưa tìm thấy việc làm phù hợp.
                <br />
                Hãy <Link to="/profile/edit" style={{ color: "#6366f1", fontWeight: 600 }}>cập nhật hồ sơ</Link> để hệ thống đề xuất tốt hơn.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar promo + score */}
        <div className="promo-cards">
          <div className="promo-card">
            <div style={{ marginBottom: "0.875rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h3>Khám phá việc làm mới nhất</h3>
            <p>Tìm kiếm công việc remote, hybrid hoặc văn phòng phù hợp với kỹ năng và mục tiêu của bạn.</p>
            <Link to="/jobs" className="btn-white">
              Xem tất cả việc làm
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="score-card">
            <p className="score-label">Điểm hoàn thiện hồ sơ</p>
            <div className="score-value">
              {overallScore}
              <span className="score-total">/100</span>
            </div>
            <div className="score-bar-bg">
              <div className="score-bar-fill" style={{ width: `${overallScore}%` }} />
            </div>
            <p style={{ fontSize: "0.75rem", marginTop: "0.75rem", opacity: 0.8, marginBottom: 0 }}>
              {overallScore >= 80
                ? "Hồ sơ của bạn rất ấn tượng! 🎉"
                : overallScore >= 50
                ? "Tiếp tục cải thiện để tăng cơ hội."
                : "Hãy hoàn thiện hồ sơ để được đề xuất nhiều hơn."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobMatchesSection;
