import React from 'react';
import Reveal from './Reveal';
import '../AIAnalysis.css';
import '../Value.css';
import './JobConnection.css';
import './RecruiterSection.css';
import pandaSpeech from '../assets/panda_speech.png';
import pandaHandshake from '../assets/panda_handshake.png';
import pandaHappy from '../assets/panda_happy.png';
import pandaInterview from '../assets/panda_interview.png';

const FeaturesSection: React.FC = () => {
  const aiFeatures = [
    {
      title: 'Phân tích AI',
      desc: 'Đánh giá chuyên sâu về kỹ thuật, tư duy và cách trình bày',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      )
    },
    {
      title: 'Chấm điểm chi tiết',
      desc: 'Điểm số cụ thể cho từng kỹ năng và tiêu chí phỏng vấn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      title: 'Lộ trình cải thiện',
      desc: 'Gợi ý cụ thể để nâng cao kỹ năng phỏng vấn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 16 8.5 11 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      )
    },
    {
      title: 'Feedback tức thì',
      desc: 'Nhận đánh giá ngay sau mỗi cuộc phỏng vấn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    }
  ];

  const jobs = [
    {
      title: 'Backend Intern',
      company: 'ABC Tech',
      location: 'Hà Nội',
      type: 'Intern',
      match: '95%',
      tags: ['Node.js', 'MongoDB', 'Express']
    },
    {
      title: 'Ban do an dem',
      company: 'Haky Food',
      location: '120 Yen Lang, Hà Nội',
      type: 'Fresher',
      match: '88%',
      tags: ['React', 'TypeScript', 'CSS']
    },
    {
      title: 'AI Engineer Intern',
      company: 'DEF Labs',
      location: 'Đà Nẵng',
      type: 'Intern',
      match: '92%',
      tags: ['Python', 'TensorFlow', 'ML']
    }
  ];

  const recruiterFeatures = [
    {
      icon: 'ti ti-users-group',
      title: 'Tiếp cận ứng viên chất lượng',
      description: 'Kết nối với sinh viên đã qua đánh giá AI, sẵn sàng làm việc'
    },
    {
      icon: 'ti ti-target-arrow',
      title: 'Tìm đúng người, đúng vị trí',
      description: 'Hệ thống gợi ý ứng viên phù hợp dựa trên kỹ năng và kinh nghiệm'
    },
    {
      icon: 'ti ti-clock-hour-4',
      title: 'Tiết kiệm thời gian tuyển dụng',
      description: 'Giảm thời gian screening với báo cáo đánh giá chi tiết từ AI'
    }
  ];

  return (
    <>
      <section className="ai-analysis-section">
        <div className="ai-analysis-container">
          <Reveal
            className="ai-analysis-content"
            delay={80}
          >
            <span className="ai-tag">Công nghệ AI</span>
            <h2 className="ai-analysis-title">
              <span>Đánh giá</span>
              <span>thông minh</span>
              <span>với AI</span>
            </h2>
            <p className="ai-analysis-desc">
              Hệ thống AI phân tích toàn diện câu trả lời của bạn, từ nội dung kỹ thuật đến cách trình bày và giao tiếp
            </p>
          </Reveal>

          <div
            className="ai-analysis-grid"
          >
            {aiFeatures.map((feature, index) => (
              <Reveal
                key={index}
                className="ai-card"
                delay={140 + index * 60}
              >
                <div className="ai-card-icon">{feature.icon}</div>
                <h3 className="ai-card-title">{feature.title}</h3>
                <p className="ai-card-desc">{feature.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="value-section">
        <div className="value-container">
          <Reveal
            as="span"
            className="value-tag"
            delay={80}
          >
            GIÁ TRỊ
          </Reveal>
          <Reveal
            as="h2"
            className="value-title"
            delay={140}
          >
            Bạn sẽ đạt được gì?
          </Reveal>

          <div
            className="value-grid"
          >
            <Reveal className="value-card image-card" delay={180}>
              <img src={pandaSpeech} alt="Panda speech" />
            </Reveal>

            <Reveal className="value-card" delay={240}>
              <div className="value-card-icon">💪</div>
              <h3 className="value-card-title">Tự tin chinh phục phỏng vấn</h3>
              <p className="value-card-desc">Không còn lo lắng trước mỗi cuộc phỏng vấn</p>
            </Reveal>

            <Reveal className="value-card image-card" delay={300}>
              <img src={pandaHandshake} alt="Panda handshake" />
            </Reveal>

            <Reveal className="value-card" delay={360}>
              <div className="value-card-icon">🗣️</div>
              <h3 className="value-card-title">Giao tiếp tốt hơn</h3>
              <p className="value-card-desc">Cải thiện cách trình bày và thuyết phục</p>
            </Reveal>

            <Reveal className="value-card" delay={420}>
              <div className="value-card-icon">🎯</div>
              <h3 className="value-card-title">Kỹ năng trả lời chuyên nghiệp</h3>
              <p className="value-card-desc">Nắm vững cách trả lời câu hỏi kỹ thuật và hành vi</p>
            </Reveal>

            <Reveal className="value-card image-card" delay={480}>
              <img src={pandaHappy} alt="Panda happy" />
            </Reveal>

            <Reveal className="value-card" delay={540}>
              <div className="value-card-icon">🤝</div>
              <h3 className="value-card-title">Kết nối cơ hội việc làm</h3>
              <p className="value-card-desc">Tiếp cận trực tiếp với nhà tuyển dụng hàng đầu</p>
            </Reveal>

            <Reveal className="value-card image-card" delay={600}>
              <img src={pandaInterview} alt="Panda interview" />
            </Reveal>
          </div>

          <Reveal
            className="value-footer-tag"
            delay={300}
          >
            <span className="sparkle-icon">✨</span>
            Sản phẩm phục vụ cho sinh viên ngành KTPM
          </Reveal>
        </div>
      </section>

      <section className="job-connection-section">
        <div className="job-container">
          <div className="job-content">
            <Reveal
              as="h2"
              className="job-title"
              delay={80}
              variant="left"
            >
              Luyện tập thì tốt.<br />
              <span className="highlight-text">Có việc làm</span> còn tốt hơn.
            </Reveal>
            <Reveal
              as="p"
              className="job-description"
              delay={160}
              variant="left"
            >
              Chuyển hóa việc luyện tập phỏng vấn thành cơ hội việc làm thực tế.
            </Reveal>

            <Reveal
              as="ul"
              className="job-benefits"
              delay={240}
              variant="left"
            >
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

            <Reveal
              as="button"
              className="explore-btn"
              delay={320}
            >
              Khám phá công việc
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Reveal>
          </div>

          <div
            className="job-cards-wrapper"
          >
            <Reveal className="floating-badge" delay={120} variant="scale">
              <div className="badge-icon">💼</div>
              <div className="badge-text">
                <span className="badge-label">Cơ hội việc làm</span>
                <span className="badge-value">200+ công ty</span>
              </div>
            </Reveal>

            {jobs.map((job, index) => (
              <Reveal
                key={index}
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
                  {job.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="job-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="apply-btn">
                  Ứng tuyển ngay
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16663 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="recruiter-section">
        <div className="recruiter-container">
          <Reveal
            className="recruiter-content"
            delay={80}
            variant="left"
          >
            <span className="recruiter-label">DÀNH CHO NHÀ TUYỂN DỤNG</span>
            <h2 className="recruiter-title">
              Tìm kiếm ứng viên IT <br />
              <span className="highlight">tài năng</span>
            </h2>
            <p className="recruiter-description">
              Đăng tin tuyển dụng và kết nối với hàng nghìn sinh viên IT
              đã được đào tạo và đánh giá bởi hệ thống AI
            </p>
            <button className="post-job-btn">
              Đăng tin tuyển dụng
              <i className="ti ti-arrow-narrow-right"></i>
            </button>
          </Reveal>

          <div
            className="recruiter-features"
          >
            {recruiterFeatures.map((feature, index) => (
              <Reveal
                key={index}
                className="recruiter-feature-card"
                delay={140 + index * 80}
              >
                <div className="feature-icon-wrapper">
                  <i className={feature.icon}></i>
                </div>
                <div className="feature-text">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
