import React, { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import '../styles/landing/Experience.css';

const DemoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || isPlaying) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      const fallbackTimer = window.setTimeout(() => setIsPlaying(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [isPlaying]);

  return (
    <section className="experience-section" ref={sectionRef}>
      <div className="experience-container">
        <Reveal
          as="span"
          className="experience-tag"
          delay={80}
        >
          Trải nghiệm
        </Reveal>
        <Reveal
          as="h2"
          className="experience-title"
          delay={140}
        >
          Giao diện thực tế
        </Reveal>
        <Reveal
          as="p"
          className="experience-desc"
          delay={200}
        >
          Trải nghiệm phỏng vấn như thật với giao diện trực quan và dễ sử dụng
        </Reveal>

        <Reveal
          className="demo-video-wrapper"
          delay={260}
          variant="scale"
        >
          {!isPlaying && <div className="glow-line-tl"></div>}
          {!isPlaying && <div className="glow-line-br"></div>}

          <div className="demo-video-content" onClick={() => setIsPlaying(true)}>
            {isPlaying ? (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/PD61lIYrG-M?autoplay=1&mute=1&playsinline=1&rel=0"
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
        </Reveal>
      </div>
    </section>
  );
};

export default DemoSection;
