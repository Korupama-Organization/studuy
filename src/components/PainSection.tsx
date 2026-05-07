import React from 'react';
import { motion } from 'framer-motion';
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
        <motion.h2 
          className="pain-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chúng ta bước vào và rời khỏi<br />
          cuộc phỏng vấn
          <span className="pain-highlight">
            mà không biết mình thiếu sót ở đâu.
          </span>
        </motion.h2>
        
        <motion.p 
          className="pain-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Không có feedback, không biết cải thiện, và cứ lặp lại sai lầm.
        </motion.p>
      </div>
    </section>
  );
};

export default PainSection;
