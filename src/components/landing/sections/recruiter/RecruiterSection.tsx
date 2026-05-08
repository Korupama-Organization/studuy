import React from 'react';
import Reveal from '../../shared/Reveal';
import './RecruiterSection.css';

const recruiterFeatures = [
  {
    icon: 'ti ti-users-group',
    title: 'Tiếp cận ứng viên chất lượng',
    description: 'Kết nối với sinh viên đã qua đánh giá AI, sẵn sàng làm việc',
  },
  {
    icon: 'ti ti-target-arrow',
    title: 'Tìm đúng người, đúng vị trí',
    description: 'Hệ thống gợi ý ứng viên phù hợp dựa trên kỹ năng và kinh nghiệm',
  },
  {
    icon: 'ti ti-clock-hour-4',
    title: 'Tiết kiệm thời gian tuyển dụng',
    description: 'Giảm thời gian screening với báo cáo đánh giá chi tiết từ AI',
  },
];

const RecruiterSection: React.FC = () => {
  return (
    <section className="recruiter-section">
      <div className="recruiter-container">
        <Reveal className="recruiter-content" delay={80} variant="left">
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

        <div className="recruiter-features">
          {recruiterFeatures.map((feature, index) => (
            <Reveal
              key={feature.title}
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
  );
};

export default RecruiterSection;

