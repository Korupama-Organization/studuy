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
}

interface JobMatchesSectionProps {
  jobs: JobMatch[];
  firstName: string;
  overallScore: number;
}

const JobMatchesSection: React.FC<JobMatchesSectionProps> = ({ jobs, firstName, overallScore }) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">JOB MATCHES FOR {firstName.toUpperCase()}</h2>
        <Link to="/jobs" className="view-all-link">
          View all 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>

      <div className="job-matches-grid">
        <div className="job-cards-list">
          {jobs.length > 0 ? jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              <div className="job-logo">
                {job.company.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '0.5rem' }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                )}
              </div>
              <div className="job-info">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company.name}</p>
                <div className="job-meta">
                  <span className="job-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {job.location}
                  </span>
                  <span className="job-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    $2,000 - $3,500 {/* Mocked salary as requested by design */}
                  </span>
                </div>
                <div className="job-actions">
                  <button className="btn-primary">Apply Now</button>
                  <button className="btn-outline">Save</button>
                </div>
              </div>
            </div>
          )) : (
             <div className="job-card" style={{ justifyContent: 'center', color: '#64748b' }}>
                No job matches found. Update your profile to get matches.
             </div>
          )}
        </div>

        <div className="promo-cards">
          <div className="promo-card">
            <div style={{ marginBottom: '1rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3>Browse our latest job openings to view & apply to the best jobs today!</h3>
            <p>Explore remote, hybrid or on-site jobs that are aligned with your experience, goals & preferences.</p>
            <Link to="/jobs" className="btn-white" style={{ textDecoration: 'none' }}>
              View all jobs
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

          <div className="score-card">
            <p className="score-label">Overall Score</p>
            <div className="score-value">
              {overallScore} <span className="score-total">/100</span>
            </div>
            <div className="score-bar-bg">
              <div className="score-bar-fill" style={{ width: `${overallScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobMatchesSection;
