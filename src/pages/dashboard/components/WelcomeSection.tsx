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
      <div className="welcome-info">
        <img 
          src={profile.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.fullName) + "&background=c7d2fe&color=3730a3"} 
          alt={profile.fullName} 
          className="welcome-avatar" 
        />
        <div className="welcome-text">
          <div className="completion-badge">
            Hồ sơ hoàn thành {profile.completionPercentage}%
          </div>
          <h1>
            Chào mừng trở lại, <span className="welcome-name-highlight">{firstName}👋</span>
          </h1>
          <p>
            Your Profile has been completed: <span className="completion-percent">{profile.completionPercentage}%</span>
          </p>
          <div className="welcome-actions">
            <Link to="/profile" className="action-link">View Profile</Link>
            <button className="action-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Generate CV</button>
            <Link to="/profile/edit" className="action-link">Update CV</Link>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="stat-value">{stats.appliedJobs}</h3>
            <p className="stat-label">Applied</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h3 className="stat-value">{stats.interviews || 0}</h3>
            <p className="stat-label">Interviews</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="stat-value">{stats.savedJobs || 0}</h3>
            <p className="stat-label">Saved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
