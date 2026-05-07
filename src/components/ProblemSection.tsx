import React from 'react';
import Reveal from './Reveal';
import '../Problem.css';

const ProblemSection: React.FC = () => {
  return (
    <section className="problem-section">
      {/* Background Decorative Orbs */}
      <div className="problem-bg-orbs">
        <div className="problem-orb-1" />
        <div className="problem-orb-2" />
      </div>

      <div className="problem-container">
        
        {/* Left: Illustration */}
        <Reveal
          className="problem-visual"
          delay={80}
          variant="left"
        >
          <div className="problem-card-wrap">
            <div className="problem-card">
              <div className="problem-card-inner">
                {/* AI Prompt */}
                <div className="problem-ai-msg">
                  <div className="problem-ai-avatar">AI</div>
                  <span className="problem-ai-text">Tell me about yourself</span>
                </div>

                {/* Center Emoji */}
                <div className="problem-character-wrap">
                  <span className="problem-emoji-main" style={{ fontSize: '96px' }}>😵‍💫</span>
                </div>

                {/* Decorative SVGs from Figma */}
                <div className="problem-svg-decor" style={{ position: 'absolute', left: '48px', top: '128px' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M23.992 43.9853C35.034 43.9853 43.9853 35.034 43.9853 23.992C43.9853 12.95 35.034 3.99866 23.992 3.99866C12.95 3.99866 3.99866 12.95 3.99866 23.992C3.99866 35.034 12.95 43.9853 23.992 43.9853Z" stroke="#E484EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.174 17.9939C18.644 16.6577 19.5718 15.531 20.793 14.8133C22.0142 14.0956 23.45 13.8332 24.8461 14.0727C26.2422 14.3121 27.5085 15.038 28.4207 16.1216C29.3329 17.2053 29.8322 18.5768 29.8301 19.9933C29.8301 23.9919 23.8321 25.9913 23.8321 25.9913" stroke="#E484EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23.992 33.9886H24.012" stroke="#E484EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="problem-svg-decor" style={{ position: 'absolute', left: '432px', top: '160px' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M19.9983 36.6634C29.2022 36.6634 36.6635 29.2022 36.6635 19.9982C36.6635 10.7943 29.2022 3.33301 19.9983 3.33301C10.7943 3.33301 3.33307 10.7943 3.33307 19.9982C3.33307 29.2022 10.7943 36.6634 19.9983 36.6634Z" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.9982 13.3322V19.9982" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.9982 26.6643H20.0149" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="problem-svg-decor" style={{ position: 'absolute', left: '448px', top: '134px' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M19.9982 28.3308H20.0149" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24.9978 3.33301H9.99912C9.11514 3.33301 8.26737 3.68417 7.6423 4.30923C7.01724 4.9343 6.66608 5.78207 6.66608 6.66605V33.3304C6.66608 34.2144 7.01724 35.0621 7.6423 35.6872C8.26737 36.3123 9.11514 36.6634 9.99912 36.6634H29.9974C30.8813 36.6634 31.7291 36.3123 32.3542 35.6872C32.9793 35.0621 33.3304 34.2144 33.3304 33.3304V11.6656L24.9978 3.33301Z" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.1653 14.9987C15.5653 13.8965 16.3399 12.97 17.3537 12.381C18.3675 11.792 19.5561 11.5781 20.7117 11.7767C21.8673 11.9752 22.9163 12.5736 23.6754 13.4672C24.4345 14.3608 24.8554 15.4928 24.8645 16.6653C24.8645 19.9983 19.8649 21.6648 19.8649 21.6648" stroke="#E484EB" strokeWidth="3.33" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Bottom bar of the "window" */}
              <div style={{ height: '12px', background: '#364153', borderRadius: '0 0 12px 12px' }} />
            </div>

            {/* Floating Bubbles */}
            <Reveal
              className="problem-bubble bubble-1"
              delay={220}
              variant="scale"
            >
              Làm sao bây giờ? 😰
            </Reveal>
            <Reveal
              className="problem-bubble bubble-2"
              delay={300}
              variant="scale"
            >
              Trả lời gì đây???
            </Reveal>

            {/* Character Image */}
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/631d6be2fe1e0c80fc81c2ebddf3bec4a44c68f4?width=776" 
              alt="Student feeling confused" 
              className="problem-confused-img"
            />
          </div>
        </Reveal>

        {/* Right: Text Content */}
        <div className="problem-content">
          <Reveal
            as="h2"
            className="problem-heading"
            delay={140}
          >
            Hầu hết sinh viên không chuẩn bị gì cho phỏng vấn thực tế.
          </Reveal>
          <Reveal
            as="p"
            className="problem-description"
            delay={220}
          >
            Họ không biết sẽ gặp gì, trả lời như thế nào, hay bị đánh giá ra sao. Điều này dẫn đến sự thiếu tự tin và bỏ lỡ nhiều cơ hội việc làm tốt.
          </Reveal>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
