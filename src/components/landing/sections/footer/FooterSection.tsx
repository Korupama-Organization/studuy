import React from 'react';
import Reveal from '../../shared/Reveal';
import logoImage from '../../../../assets/Logo.png';
import './FooterSection.css';

const FooterSection: React.FC = () => {
  return (
    <footer className="footer-section">
      <Reveal
        className="footer-container"
        delay={80}
      >
        <div className="footer-top">
          {/* Logo and About */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoImage} alt="SEeds" className="footer-logo-image" />
              <span className="logo-text">SEeds</span>
            </div>
            <p className="footer-description">
              Nền tảng phỏng vấn AI giúp sinh viên kỹ thuật phần mềm nhận được công việc mơ ước
            </p>
            <div className="social-links">
              <a href="#" className="social-icon fb" aria-label="Facebook"><i className="ti ti-brand-facebook"></i></a>
              <a href="#" className="social-icon tw" aria-label="Twitter"><i className="ti ti-brand-twitter"></i></a>
              <a href="#" className="social-icon li" aria-label="LinkedIn"><i className="ti ti-brand-linkedin"></i></a>
              <a href="#" className="social-icon mail" aria-label="Email"><i className="ti ti-mail"></i></a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-heading">Sản phẩm</h4>
              <ul className="footer-links">
                <li><a href="#">Tính năng</a></li>
                <li><a href="#">Cách hoạt động</a></li>
                <li><a href="#">Trường hợp sử dụng</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Công ty</h4>
              <ul className="footer-links">
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#">Liên hệ</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Pháp lý</h4>
              <ul className="footer-links">
                <li><a href="#">Chính sách bảo mật</a></li>
                <li><a href="#">Điều khoản dịch vụ</a></li>
                <li><a href="#">Chính sách Cookie</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2026 SEeds</p>
          <div className="bottom-links">
            <a href="#">Bảo mật</a>
            <a href="#">Điều khoản</a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
};

export default FooterSection;
