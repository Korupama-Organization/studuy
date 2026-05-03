import React from 'react';
import '../Pain.css';

const PainSection: React.FC = () => {
  return (
    <section className="pain-section">
      {/* Background Decorative Orbs */}
      <div className="pain-bg-orbs">
        <div className="pain-orb-1" />
        <div className="pain-orb-2" />
      </div>

      <div className="pain-container">
        <h2 className="pain-title">
          Chúng ta bước vào và rời khỏi<br />
          cuộc phỏng vấn
          <span className="pain-highlight">
            mà không biết mình thiếu sót ở đâu.
          </span>
        </h2>
        
        <p className="pain-subtitle">
          Không có feedback, không biết cải thiện, và cứ lặp lại sai lầm.
        </p>
      </div>
    </section>
  );
};

export default PainSection;
