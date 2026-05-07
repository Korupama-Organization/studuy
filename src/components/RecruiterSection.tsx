import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.div 
          className="recruiter-content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
        </motion.div>

        <motion.div 
          className="recruiter-features"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
          }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="recruiter-feature-card"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="feature-icon-wrapper">
                <i className={feature.icon}></i>
              </div>
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RecruiterSection;
