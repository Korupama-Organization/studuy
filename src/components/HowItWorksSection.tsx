import React from 'react';
import '../HowItWorks.css';

const HowItWorksSection: React.FC = () => {
  const steps = [
    { number: 1, icon: '👤', title: 'Cập nhật hồ sơ', desc: 'Điền kỹ năng, dự án và kinh nghiệm.', row: 1 },
    { number: 2, icon: '🤖', title: 'Bắt đầu phỏng vấn AI', desc: 'Nhận câu hỏi dựa trên hồ sơ.', row: 1 },
    { number: 3, icon: '🎤', title: 'Trả lời bằng giọng nói', desc: 'Nói tự nhiên như phỏng vấn thật.', row: 1 },
    { number: 6, icon: '🔄', title: 'Tiếp tục tập luyện', desc: 'Đừng lo lắng. Hãy trau dồi thêm kiến thức và trở lại.', row: 2 },
    { number: 5, icon: '📊', title: 'Nhận feedback ngay', desc: 'Điểm số, điểm mạnh và cải thiện.', row: 2 },
    { number: 4, icon: '💻', title: 'Coding interview', desc: 'Giải bài tập code trực tiếp.', row: 2 }
  ];

  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2 className="how-title">Cách hoạt động</h2>
          <p className="how-subtitle">Bắt đầu với 6 bước đơn giản</p>
        </div>

        <div className="how-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon-wrapper">
                <span>{step.icon}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              
              {/* Mũi tên hàng 1: Trỏ sang phải (1->2, 2->3) */}
              {step.row === 1 && step.number < 3 && (
                <div className="step-arrow arrow-right">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <polyline points="15 5 22 12 15 19"></polyline>
                  </svg>
                </div>
              )}

              {/* Mũi tên chuyển hàng: Trỏ xuống (3->4) */}
              {step.number === 3 && (
                <div className="step-arrow arrow-down">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <polyline points="15 5 22 12 15 19"></polyline>
                  </svg>
                </div>
              )}

              {/* Mũi tên hàng 2: Trỏ sang trái (4->5, 5->6) */}
              {(step.number === 4 || step.number === 5) && (
                <div className="step-arrow arrow-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <polyline points="15 5 22 12 15 19"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="how-footer">
          <span className="lightning-icon">⚡</span>
          <span>Thời gian trung bình: 18-36 phút</span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
