import React from 'react';
import { motion } from 'framer-motion';
import './CTASection.css';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      {/* Decorative background blobs */}
      <div className="cta-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="cta-container">
        <motion.div 
          className="cta-badge"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
            <i className="ti ti-sparkles"></i>
            Hoàn toàn miễn phí
        </motion.div>
        
        <motion.h2 
          className="cta-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Sẵn sàng chinh phục <br />
          phỏng vấn?
        </motion.h2>
        
        <motion.p 
          className="cta-description"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Tham gia cùng hàng nghìn sinh viên IT đang luyện tập <br className="hidden md:block" />
          và chuẩn bị cho sự nghiệp của mình
        </motion.p>

        <motion.div 
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="cta-btn-primary">
            Bắt đầu luyện tập ngay
            <i className="ti ti-arrow-narrow-right"></i>
          </button>
          <button className="cta-btn-secondary">
            Xem demo
          </button>
        </motion.div>

        <motion.p 
          className="cta-footer-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          Không cần tạo tài khoản - Hoàn toàn miễn phí cho sinh viên và doanh nghiệp tuyển dụng
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
