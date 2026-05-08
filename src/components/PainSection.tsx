import React from 'react';
import Reveal from './Reveal';
import '../styles/landing/Pain.css';

const PainSection: React.FC = () => {
  return (
    <section className="pain-section">
      <div className="pain-bg-orbs">
        <div className="pain-orb-1" />
        <div className="pain-orb-2" />
      </div>

      <div className="pain-container">
        <Reveal
          as="h2"
          className="pain-title"
          delay={80}
        >
          Chúng ta bước vào và rời khỏi<br />
          cuộc phỏng vấn
          <span className="pain-highlight">
            mà không biết mình thiếu sót ở đâu.
          </span>
        </Reveal>

        <Reveal
          as="p"
          className="pain-subtitle"
          delay={180}
        >
          Không có feedback, không biết cải thiện, và cứ lặp lại sai lầm.
        </Reveal>
      </div>
    </section>
  );
};

export default PainSection;
