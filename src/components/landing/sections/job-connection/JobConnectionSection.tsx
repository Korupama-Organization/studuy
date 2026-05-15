import React from 'react';
import Reveal from '../../shared/Reveal';
import './JobConnectionSection.css';

const jobs = [
  {
    title: 'Backend Intern',
    company: 'InnoTech',
    location: 'Hà Nội',
    type: 'Intern',
    match: '95%',
    tags: ['Node.js', 'MongoDB', 'Express'],
  },
  {
    title: 'Software Engineer Fresher',
    company: 'VNPT Technology',
    location: 'Ho Chi Minh City',
    type: 'Fresher',
    match: '88%',
    tags: ['React', 'TypeScript', 'CSS'],
  },
  {
    title: 'AI Engineer Intern',
    company: 'MTI Labs',
    location: 'Đà Nẵng',
    type: 'Intern',
    match: '92%',
    tags: ['Python', 'TensorFlow', 'ML'],
  },
];

const JobConnectionSection: React.FC = () => {
  return (
    <section className="job-connection-section">
      <div className="job-container">
        <div className="job-content">
          <Reveal as="h2" className="job-title" delay={80} variant="left">
            Luyện tập thì tốt.<br />
            <span className="highlight-text">Có việc làm</span> còn tốt hơn.
          </Reveal>
          <Reveal as="p" className="job-description" delay={160} variant="left">
            Chuyển hóa việc luyện tập phỏng vấn thành cơ hội việc làm thực tế.
          </Reveal>

          <Reveal as="ul" className="job-benefits" delay={240} variant="left">
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span>Ứng tuyển vào công ty đối tác</span>
            </li>
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span>Được sàng lọc tự động dựa trên hồ sơ</span>
            </li>
            <li>
              <div className="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span>Nhận lời mời phỏng vấn dựa trên kết quả</span>
            </li>
          </Reveal>

          <Reveal as="a" href="/login" className="explore-btn" delay={320} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Khám phá công việc
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Reveal>
        </div>

        <div className="job-cards-wrapper">
          <Reveal className="floating-badge" delay={120} variant="scale">
            <div className="badge-icon">💼</div>
            <div className="badge-text">
              <span className="badge-label">Cơ hội việc làm</span>
              <span className="badge-value">200+ công ty</span>
            </div>
          </Reveal>

          {jobs.map((job, index) => (
            <Reveal
              key={`${job.company}-${job.title}`}
              className="job-card"
              delay={180 + index * 80}
            >
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
                {job.tags.map((tag) => (
                  <span key={tag} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="/login" className="apply-btn" style={{ textDecoration: 'none' }}>
                Ứng tuyển ngay
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobConnectionSection;

