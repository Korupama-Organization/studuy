import React from "react";
import { Link } from "react-router-dom";

interface WelcomeSectionProps {
  profile: {
    fullName: string;
    avatarUrl: string | null;
    completionPercentage: number;
  };
  stats: {
    appliedJobs: number;
    matchedJobs: number;
    profileCompletion: number;
    interviews?: number;
    savedJobs?: number;
  };
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ profile, stats }) => {
  const firstName = profile.fullName.split(" ").pop()?.toUpperCase() || "BẠN";

  return (
    <section className="welcome-section">
      {/* Left: avatar + greeting */}
      <div className="welcome-info">
        <img
          src={
            profile.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=6366f1&color=fff&size=128`
          }
          alt={profile.fullName}
          className="welcome-avatar"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=6366f1&color=fff&size=128`;
          }}
        />
        <div className="welcome-text">
          <div className="completion-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Hồ sơ hoàn thành <span className="completion-percent">{profile.completionPercentage}%</span>
          </div>
          <h1>
            Chào mừng trở lại,{" "}
            <span className="welcome-name-highlight">{firstName} 👋</span>
          </h1>
          <p>
            Hôm nay là một ngày tuyệt vời để tìm cơ hội mới cho bạn!
          </p>
          <div className="welcome-actions">
            <Link to="/profile" className="action-link">Xem hồ sơ</Link>
            <Link to="/profile/edit" className="action-link">Cập nhật CV</Link>
            <Link to="/jobs" className="action-link">Tìm việc làm</Link>
          </div>
        </div>
      </div>

      {/* Right: stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3 className="stat-value">{stats.appliedJobs}</h3>
          <p className="stat-label">Đã ứng tuyển</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="stat-value">{stats.interviews ?? 0}</h3>
          <p className="stat-label">Phỏng vấn</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="stat-value">{stats.matchedJobs}</h3>
          <p className="stat-label">Việc phù hợp</p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
