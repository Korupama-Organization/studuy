import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">AI</div>
            <span>SEeds</span>
          </div>
          <p className="footer-desc">
            Nền tảng phỏng vấn AI giúp sinh viên kỹ thuật phần mềm nhận được công việc mơ ước.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">t</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">ig</a>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Sản phẩm</h4>
          <ul className="footer-links">
            <li><Link to="/features">Tính năng</Link></li>
            <li><Link to="/how-it-works">Cách thức hoạt động</Link></li>
            <li><Link to="/pricing">Trị giá hàng đầu</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Công ty</h4>
          <ul className="footer-links">
            <li><Link to="/about">Về chúng tôi</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul className="footer-links">
            <li><Link to="/privacy">Chính sách bảo mật</Link></li>
            <li><Link to="/terms">Điều khoản dịch vụ</Link></li>
            <li><Link to="/cookies">Chính sách Cookie</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>© 2026 SEeds</div>
        <div className="footer-bottom-links">
          <Link to="/privacy">Bảo mật</Link>
          <Link to="/terms">Điều khoản</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
