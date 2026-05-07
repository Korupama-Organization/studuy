import React from 'react';
import { motion } from 'framer-motion';
import '../Value.css';
import pandaSpeech from '../assets/panda_speech.png';
import pandaHandshake from '../assets/panda_handshake.png';
import pandaHappy from '../assets/panda_happy.png';
import pandaInterview from '../assets/panda_interview.png';

const ValueSection: React.FC = () => {
  return (
    <section className="value-section">
      <div className="value-container">
        <motion.span 
          className="value-tag"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          GIÁ TRỊ
        </motion.span>
        <motion.h2 
          className="value-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Bạn sẽ đạt được gì?
        </motion.h2>

        <motion.div 
          className="value-grid"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
          }}
        >
          {/* Row 1 */}
          <motion.div className="value-card image-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <img src={pandaSpeech} alt="Panda speech" />
          </motion.div>
          
          <motion.div className="value-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <div className="value-card-icon">💪</div>
            <h3 className="value-card-title">Tự tin chinh phục phỏng vấn</h3>
            <p className="value-card-desc">Không còn lo lắng trước mỗi cuộc phỏng vấn</p>
          </motion.div>

          <motion.div className="value-card image-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <img src={pandaHandshake} alt="Panda handshake" />
          </motion.div>

          <motion.div className="value-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <div className="value-card-icon">🗣️</div>
            <h3 className="value-card-title">Giao tiếp tốt hơn</h3>
            <p className="value-card-desc">Cải thiện cách trình bày và thuyết phục</p>
          </motion.div>

          {/* Row 2 */}
          <motion.div className="value-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <div className="value-card-icon">🎯</div>
            <h3 className="value-card-title">Kỹ năng trả lời chuyên nghiệp</h3>
            <p className="value-card-desc">Nắm vững cách trả lời câu hỏi kỹ thuật và hành vi</p>
          </motion.div>

          <motion.div className="value-card image-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <img src={pandaHappy} alt="Panda happy" />
          </motion.div>

          <motion.div className="value-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <div className="value-card-icon">🤝</div>
            <h3 className="value-card-title">Kết nối cơ hội việc làm</h3>
            <p className="value-card-desc">Tiếp cận trực tiếp với nhà tuyển dụng hàng đầu</p>
          </motion.div>

          <motion.div className="value-card image-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <img src={pandaInterview} alt="Panda interview" />
          </motion.div>
        </motion.div>

        <motion.div 
          className="value-footer-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <span className="sparkle-icon">✨</span>
          Sản phẩm phục vụ cho sinh viên ngành KTPM
        </motion.div>
      </div>
    </section>
  );
};

export default ValueSection;
