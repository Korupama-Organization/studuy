import React from "react";
import type { RecruiterInfo, CompanyInfo } from "../../../services/dashboardService";

interface RecruiterTopBarProps {
  recruiter: RecruiterInfo | null;
  company: CompanyInfo | null;
}

const RecruiterTopBar: React.FC<RecruiterTopBarProps> = ({ recruiter, company }) => {
  const initials = recruiter?.fullName
    ? recruiter.fullName.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : "HR";

  return (
    <header className="rd-topbar">
      <div className="rd-topbar-title">
        <h1>Tổng quan doanh nghiệp</h1>
        <p>
          Chào mừng trở lại, quản trị viên{company ? ` · ${company.name}` : ""}
        </p>
      </div>

      <div className="rd-topbar-right">
        {/* Notification bell */}
        <button className="rd-topbar-notifications" aria-label="Thông báo">
          <span className="rd-notif-dot" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User badge */}
        <div className="rd-user-badge">
          {recruiter?.avatarUrl ? (
            <img
              src={recruiter.avatarUrl}
              alt={recruiter.fullName}
              className="rd-user-avatar"
            />
          ) : (
            <div className="rd-user-avatar">{initials}</div>
          )}
          <div className="rd-user-info">
            <span className="rd-user-name">{recruiter?.fullName || "HR Manager"}</span>
            <span className="rd-user-role">{recruiter?.jobTitle || recruiter?.membershipRole || "HR"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RecruiterTopBar;
