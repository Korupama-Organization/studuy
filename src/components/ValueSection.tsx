import React from 'react';
import '../Value.css';
import pandaSpeech from '../assets/panda_speech.png';
import pandaHandshake from '../assets/panda_handshake.png';
import pandaHappy from '../assets/panda_happy.png';
import pandaInterview from '../assets/panda_interview.png';

const ValueSection: React.FC = () => {
  return (
    <section className="value-section">
      <div className="value-container">
        <span className="value-tag">GIÁ TRỊ</span>
        <h2 className="value-title">Bạn sẽ đạt được gì?</h2>

        <div className="value-grid">
          {/* Row 1 */}
          <div className="value-card image-card">
            <img src={pandaSpeech} alt="Panda speech" />
          </div>
          
          <div className="value-card">
            <div className="value-card-icon">💪</div>
            <h3 className="value-card-title">Tự tin chinh phục phỏng vấn</h3>
            <p className="value-card-desc">Không còn lo lắng trước mỗi cuộc phỏng vấn</p>
          </div>

          <div className="value-card image-card">
            <img src={pandaHandshake} alt="Panda handshake" />
          </div>

          <div className="value-card">
            <div className="value-card-icon">🗣️</div>
            <h3 className="value-card-title">Giao tiếp tốt hơn</h3>
            <p className="value-card-desc">Cải thiện cách trình bày và thuyết phục</p>
          </div>

          {/* Row 2 */}
          <div className="value-card">
            <div className="value-card-icon">🎯</div>
            <h3 className="value-card-title">Kỹ năng trả lời chuyên nghiệp</h3>
            <p className="value-card-desc">Nắm vững cách trả lời câu hỏi kỹ thuật và hành vi</p>
          </div>

          <div className="value-card image-card">
            <img src={pandaHappy} alt="Panda happy" />
          </div>

          <div className="value-card">
            <div className="value-card-icon">🤝</div>
            <h3 className="value-card-title">Kết nối cơ hội việc làm</h3>
            <p className="value-card-desc">Tiếp cận trực tiếp với nhà tuyển dụng hàng đầu</p>
          </div>

          <div className="value-card image-card">
            <img src={pandaInterview} alt="Panda interview" />
          </div>
        </div>

        <div className="value-footer-tag">
          <span className="sparkle-icon">✨</span>
          Sản phẩm phục vụ cho sinh viên ngành KTPM
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
