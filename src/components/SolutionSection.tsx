import React from 'react';
import Reveal from './Reveal';
import '../Solution.css';

const SolutionSection: React.FC = () => {
  return (
    <section className="solution-section">
      <div className="solution-container">
        
        {/* Left Side: Text and Content */}
        <div className="solution-content">
          <Reveal
            as="h2"
            className="solution-heading"
            delay={80}
            variant="left"
          >
            Gặp gỡ trợ lý <br />
            <span>AI</span> phỏng vấn
          </Reveal>
          <Reveal
            as="p"
            className="solution-description"
            delay={160}
            variant="left"
          >
            Luyện tập câu hỏi phỏng vấn thực tế, trả lời bằng giọng nói và nhận feedback ngay lập tức.
          </Reveal>
          
          <Reveal
            as="ul"
            className="solution-features"
            delay={240}
            variant="left"
          >
            <li className="solution-feature-item">
              <span className="solution-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              Đặt câu hỏi linh hoạt theo từng vị trí
            </li>
            <li className="solution-feature-item">
              <span className="solution-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              Lắng nghe câu trả lời của bạn realtime
            </li>
            <li className="solution-feature-item">
              <span className="solution-feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              Đánh giá kết quả ngay lập tức
            </li>
          </Reveal>

          <Reveal
            className="solution-actions"
            delay={320}
          >
            <button className="btn-primary-sol">Cách hoạt động</button>
            <button className="btn-secondary-sol">Vậy còn việc làm...</button>
          </Reveal>
        </div>

        {/* Right Side: Interactive Mockup */}
        <Reveal
          className="solution-visual"
          delay={160}
          variant="right"
        >
          <div className="mockup-card">
            <div className="mockup-badge">✨ Hỗ trợ AI</div>
            
            <div className="mockup-header">
              <div className="mockup-user">
                <div className="mockup-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                    <path d="M12 6a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path>
                  </svg>
                </div>
                <div className="mockup-user-info">
                  <h4>AI Phỏng vấn</h4>
                  <p>Vị trí Senior Developer</p>
                </div>
              </div>
              <div className="mockup-status">Đang hoạt động</div>
            </div>

            <div className="mockup-chat">
              <div className="mockup-label">Câu hỏi</div>
              <Reveal
                className="mockup-bubble bubble-ai"
                delay={320}
              >
                "Hãy kể về một dự án bạn đã làm"
              </Reveal>

              <div className="mockup-label">Câu trả lời của bạn</div>
              <Reveal
                className="mockup-bubble bubble-user"
                delay={400}
              >
                "Em đã xây dựng một ứng dụng web sử dụng Node.js và React giúp các team cộng tác làm việc. Thử thách chính là..."
              </Reveal>

              <Reveal
                className="mockup-voice-bar"
                delay={480}
                variant="scale"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <span>Đang lắng nghe...</span>
                <div className="voice-wave" style={{ marginLeft: 'auto' }}>
                  <div className="wave-bar active"></div>
                  <div className="wave-bar active wave-bar--mid"></div>
                  <div className="wave-bar active wave-bar--tall"></div>
                  <div className="wave-bar active wave-bar--short"></div>
                  <div className="wave-bar active wave-bar--mid"></div>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default SolutionSection;
