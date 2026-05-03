import React from 'react';
import './RecruiterSection.css';

const RecruiterSection: React.FC = () => {
  const features = [
    {
      icon: "ti ti-users-group",
      title: "Tiếp cận ứng viên chất lượng",
      description: "Kết nối với sinh viên đã qua đánh giá AI, sẵn sàng làm việc"
    },
    {
      icon: "ti ti-target-arrow",
      title: "Tìm đúng người, đúng vị trí",
      description: "Hệ thống gợi ý ứng viên phù hợp dựa trên kỹ năng và kinh nghiệm"
    },
    {
      icon: "ti ti-clock-hour-4",
      title: "Tiết kiệm thời gian tuyển dụng",
      description: "Giảm thời gian screening với báo cáo đánh giá chi tiết từ AI"
    }
  ];

  return (
    <section className="recruiter-section">
      <div className="recruiter-container">
        <div className="recruiter-content">
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
        </div>

        <div className="recruiter-features">
          {features.map((feature, index) => (
            <div key={index} className="recruiter-feature-card">
              <div className="feature-icon-wrapper">
                <i className={feature.icon}></i>
              </div>
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;
