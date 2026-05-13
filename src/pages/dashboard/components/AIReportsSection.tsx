import React from "react";

export interface AIReport {
  id: string;
  comment: string;
  status: string;
  videoUrl: string | null;
}

interface AIReportsSectionProps {
  reports: AIReport[];
}

const AIReportsSection: React.FC<AIReportsSectionProps> = ({ reports }) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">AI Interview Reports</h2>
      </div>

      <div className="ai-reports-container">
        <div className="ai-reports-toolbar">
          <div className="toolbar-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search candidates..." />
          </div>
          <button className="toolbar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter by Status
          </button>
          <button className="toolbar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Save
          </button>
        </div>

        <table className="ai-table">
          <thead>
            <tr>
              <th>APPLICATION ID</th>
              <th>VIDEO RESUME</th>
              <th>AI COMMENT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {reports && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id}>
                  <td className="app-id">{report.id}</td>
                  <td>
                    {report.videoUrl ? (
                      <a href={report.videoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button className="btn-video">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Watch Recording
                        </button>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No recording</span>
                    )}
                  </td>
                  <td>
                    <p className="ai-comment">{report.comment}</p>
                    <a href="#" className="view-report-link">
                      View Full Report
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </td>
                  <td>
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>
                      {report.status === 'Passed' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      )}
                      {report.status === 'Pending' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      )}
                      {report.status === 'Failed' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      )}
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#64748b" }}>
                  No AI interview reports available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AIReportsSection;
