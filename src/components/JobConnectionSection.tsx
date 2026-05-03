import React from 'react';
import './JobConnection.css';

const JobConnectionSection: React.FC = () => {
  const jobs = [
    {
      title: "Backend Intern",
      company: "ABC Tech",
      location: "Hà Nội",
      type: "Intern",
      match: "95%",
      tags: ["Node.js", "MongoDB", "Express"]
    },
    {
      title: "Ban do an dem",
      company: "Haky Food",
      location: "120 Yen Lang, Hà Nội",
      type: "Fresher",
      match: "88%",
      tags: ["React", "TypeScript", "CSS"]
    },
    {
      title: "AI Engineer Intern",
      company: "DEF Labs",
      location: "Đà Nẵng",
      type: "Intern",
      match: "92%",
      tags: ["Python", "TensorFlow", "ML"]
    }
  ];

  return (
    <section className="job-connection-section">
      <div className="job-container">
        <div className="job-content">
          <h2 className="job-title">
            Luyện tập thì tốt.<br />
            <span className="highlight-text">Có việc làm</span> còn tốt hơn.
          </h2>
          <p className="job-description">
            Chuyển hóa việc luyện tập phỏng vấn thành cơ hội việc làm thực tế.
          </p>

          <ul className="job-benefits">
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Ứng tuyển vào công ty đối tác</span>
            </li>
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Được sàng lọc tự động dựa trên hồ sơ</span>
            </li>
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Nhận lời mời phỏng vấn dựa trên kết quả</span>
            </li>
          </ul>

          <button className="explore-btn">
            Khám phá công việc
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="job-cards-wrapper">
          <div className="floating-badge">
            <div className="badge-icon">💼</div>
            <div className="badge-text">
              <span className="badge-label">Cơ hội việc làm</span>
              <span className="badge-value">200+ công ty</span>
            </div>
          </div>

          {jobs.map((job, index) => (
            <div key={index} className="job-card">
              <div className="job-card-header">
                <div className="job-info-main">
                  <div className="job-title-row">
                    <h3 className="job-card-title">{job.title}</h3>
                    <span className="job-type-tag">{job.type}</span>
                  </div>
                  <div className="job-meta">
                    <span className="job-company">
                      <i className="ti ti-building"></i> {job.company}
                    </span>
                    <span className="job-location">
                      <i className="ti ti-map-pin"></i> {job.location}
                    </span>
                  </div>
                </div>
                <div className="job-match">
                  <span className="match-label">Match</span>
                  <span className="match-value">{job.match}</span>
                </div>
              </div>

              <div className="job-tags">
                {job.tags.map((tag, tIndex) => (
                  <span key={tIndex} className="job-tag">{tag}</span>
                ))}
              </div>

              <button className="apply-btn">
                Ứng tuyển ngay
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobConnectionSection;
