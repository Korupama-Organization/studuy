import React from 'react';
import { motion } from 'framer-motion';
import '../Hero.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hs-slide">
      {/* Decorative blurred background orbs */}
      <div className="hs-orbs">
        <div className="hs-orb hs-orb--tl" />
        <div className="hs-orb hs-orb--br" />
      </div>

      <div className="hs-inner">
        {/* Left: text content */}
        <div className="hs-text">
          <motion.h1 
            className="hs-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Tìm việc đã khó.{'\n'}Phỏng vấn{'\n'}càng khó hơn.
          </motion.h1>

          <motion.p 
            className="hs-subtext"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bạn có muốn luyện tập phỏng vấn{'\n'}và có việc làm ngay trên ghế nhà trường không?
          </motion.p>

          <motion.div 
            className="hs-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="hs-btn hs-btn--primary">Bắt đầu ngay</button>
            <button className="hs-btn hs-btn--ghost">Tìm hiểu thêm</button>
          </motion.div>
        </div>

        {/* Right: hero image */}
        <motion.div 
          className="hs-img-wrap"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img
            className="hs-img"
            src="https://api.builder.io/api/v1/image/assets/TEMP/cbed37822f8189868527856abd6d08dd08bee886?width=1480"
            alt="Khó khăn trong Job và Interview"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="hs-scroll">
        <div className="hs-scroll-dot" />
      </div>
    </section>
  );
};

export default HeroSection;
