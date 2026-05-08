import React from 'react';
import Reveal from '../../shared/Reveal';
import './HeroSection.css';

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
          <Reveal
            as="h1"
            className="hs-heading"
            delay={80}
          >
            Tìm việc đã khó.{'\n'}Phỏng vấn{'\n'}càng khó hơn.
          </Reveal>

          <Reveal
            as="p"
            className="hs-subtext"
            delay={160}
          >
            Bạn có muốn luyện tập phỏng vấn{'\n'}và có việc làm ngay trên ghế nhà trường không?
          </Reveal>

          <Reveal
            className="hs-cta"
            delay={240}
          >
            <button className="hs-btn hs-btn--primary">Bắt đầu ngay</button>
            <button className="hs-btn hs-btn--ghost">Tìm hiểu thêm</button>
          </Reveal>
        </div>

        {/* Right: hero image */}
        <Reveal
          className="hs-img-wrap"
          delay={180}
          variant="right"
        >
          <img
            className="hs-img"
            src="https://api.builder.io/api/v1/image/assets/TEMP/cbed37822f8189868527856abd6d08dd08bee886?width=1480"
            alt="Khó khăn trong Job và Interview"
            loading="eager"
            fetchPriority="high"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
