import React from 'react';
import './CTASection.css';

const CTASection: React.FC = () => {
  return (
    <section className="cta-section">
      {/* Decorative background blobs */}
      <div className="cta-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="cta-container">
        <div className="cta-badge">
            <i className="ti ti-sparkles"></i>
            Hoàn toàn miễn phí
        </div>
        
        <h2 className="cta-title">
          Sẵn sàng chinh phục <br />
          phỏng vấn?
        </h2>
        
        <p className="cta-description">
          Tham gia cùng hàng nghìn sinh viên IT đang luyện tập <br className="hidden md:block" />
          và chuẩn bị cho sự nghiệp của mình
        </p>

        <div className="cta-buttons">
          <button className="cta-btn-primary">
            Bắt đầu luyện tập ngay
            <i className="ti ti-arrow-narrow-right"></i>
          </button>
          <button className="cta-btn-secondary">
            Xem demo
          </button>
        </div>

        <p className="cta-footer-text">
          Không cần tạo tài khoản - Hoàn toàn miễn phí cho sinh viên và doanh nghiệp tuyển dụng
        </p>
      </div>
    </section>
  );
};

export default CTASection;
