import React from 'react';
import '../AIAnalysis.css';

const AIAnalysisSection: React.FC = () => {
  const features = [
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

  return (
    <section className="ai-analysis-section">
      <div className="ai-analysis-container">
        <div className="ai-analysis-content">
          <span className="ai-tag">Công nghệ AI</span>
          <h2 className="ai-analysis-title">
            <span>Đánh giá</span>
            <span>thông minh</span>
            <span>với AI</span>
          </h2>
          <p className="ai-analysis-desc">
            Hệ thống AI phân tích toàn diện câu trả lời của bạn, từ nội dung kỹ thuật đến cách trình bày và giao tiếp
          </p>
        </div>

        <div className="ai-analysis-grid">
          {features.map((feature, index) => (
            <div key={index} className="ai-card">
              <div className="ai-card-icon">
                {feature.icon}
              </div>
              <h3 className="ai-card-title">{feature.title}</h3>
              <p className="ai-card-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIAnalysisSection;
