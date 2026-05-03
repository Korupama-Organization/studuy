import React, { useState } from 'react';
import '../Experience.css';

const ExperienceSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="experience-section">
      <div className="experience-container">
        <span className="experience-tag">Trải nghiệm</span>
        <h2 className="experience-title">Giao diện thực tế</h2>
        <p className="experience-desc">
          Trải nghiệm phỏng vấn như thật với giao diện trực quan và dễ sử dụng
        </p>

        <div className="demo-video-wrapper">
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
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
