import React from 'react';
import Reveal from '../../shared/Reveal';
import './CTASection.css';
import { useNavigation } from '../../../../contexts/NavigationContext';

const CTASection: React.FC = () => {
  const { goToSlide } = useNavigation();
  return (
    <section className="cta-section">
      {/* Decorative background blobs */}
      <div className="cta-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="cta-container">
        <Reveal
          className="cta-badge"
          delay={80}
        >
            <i className="ti ti-sparkles"></i>
            Hoàn toàn miễn phí
        </Reveal>
        
        <Reveal
          as="h2"
          className="cta-title"
          delay={140}
        >
          Sẵn sàng chinh phục <br />
          phỏng vấn?
        </Reveal>
        
        <Reveal
          as="p"
          className="cta-description"
          delay={200}
        >
          Tham gia cùng hàng nghìn sinh viên IT đang luyện tập <br className="hidden md:block" />
          và chuẩn bị cho sự nghiệp của mình
        </Reveal>

        <Reveal
          className="cta-buttons"
          delay={260}
        >
          <a href="/login" className="cta-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Bắt đầu luyện tập ngay
            <i className="ti ti-arrow-narrow-right"></i>
          </a>
          <button className="cta-btn-secondary" onClick={() => goToSlide(9)}>
            Xem demo
          </button>
        </Reveal>

        <Reveal
          as="p"
          className="cta-footer-text"
          delay={320}
        >
          Không cần tạo tài khoản - Hoàn toàn miễn phí cho sinh viên và doanh nghiệp tuyển dụng
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;
