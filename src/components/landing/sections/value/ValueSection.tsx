import React from 'react';
import pandaHappy from '../../../../assets/panda_happy.png';
import pandaHandshake from '../../../../assets/panda_handshake.png';
import pandaInterview from '../../../../assets/panda_interview.png';
import pandaSpeech from '../../../../assets/panda_speech.png';
import Reveal from '../../shared/Reveal';
import './ValueSection.css';

const ValueSection: React.FC = () => {
  return (
    <section className="value-section">
      <div className="value-container">
        <Reveal as="span" className="value-tag" delay={80}>
          GIÁ TRỊ
        </Reveal>
        <Reveal as="h2" className="value-title" delay={140}>
          Bạn sẽ đạt được gì?
        </Reveal>

        <div className="value-grid">
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

        <Reveal className="value-footer-tag" delay={300}>
          <span className="sparkle-icon">✨</span>
          Sản phẩm phục vụ cho sinh viên ngành KTPM
        </Reveal>
      </div>
    </section>
  );
};

export default ValueSection;

