import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../Experience.css';

const ExperienceSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="experience-section">
      <div className="experience-container">
        <motion.span 
          className="experience-tag"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Trải nghiệm
        </motion.span>
        <motion.h2 
          className="experience-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Giao diện thực tế
        </motion.h2>
        <motion.p 
          className="experience-desc"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Trải nghiệm phỏng vấn như thật với giao diện trực quan và dễ sử dụng
        </motion.p>

        <motion.div 
          className="demo-video-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {!isPlaying && <div className="glow-line-tl"></div>}
          {!isPlaying && <div className="glow-line-br"></div>}
          
          <div className="demo-video-content" onClick={() => setIsPlaying(true)}>
            {isPlaying ? (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/PD61lIYrG-M?autoplay=1"
                title="Demo phỏng vấn với AI"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="youtube-iframe"
              ></iframe>
            ) : (
              <>
                <div className="play-button">
                  <div className="play-icon"></div>
                </div>
                <h3 className="demo-text-title">Demo phỏng vấn với AI</h3>
                <p className="demo-text-subtitle">Nhấn để xem video demo</p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
