import React from 'react';
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
          <h1 className="hs-heading">
            Tìm việc đã khó.{'\n'}Phỏng vấn{'\n'}càng khó hơn.
          </h1>

          <p className="hs-subtext">
            Bạn có muốn luyện tập phỏng vấn{'\n'}và có việc làm ngay trên ghế nhà trường không?
          </p>

          <div className="hs-cta">
            <button className="hs-btn hs-btn--primary">Bắt đầu ngay</button>
            <button className="hs-btn hs-btn--ghost">Tìm hiểu thêm</button>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="hs-img-wrap">
          <img
            className="hs-img"
            src="https://api.builder.io/api/v1/image/assets/TEMP/cbed37822f8189868527856abd6d08dd08bee886?width=1480"
            alt="Khó khăn trong Job và Interview"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hs-scroll">
        <div className="hs-scroll-dot" />
      </div>
    </section>
  );
};

export default HeroSection;
