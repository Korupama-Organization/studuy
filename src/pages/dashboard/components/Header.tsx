import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="dashboard-header">
      <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
        <div className="footer-logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>AI</div>
        <span>SEeds</span>
      </Link>
      
      <nav className="header-nav">
        <Link to="/dashboard" className="header-link active">Bảng điều khiển</Link>
        <Link to="/mock-interview" className="header-link">Phỏng vấn thử</Link>
        <Link to="/jobs" className="header-link">Việc làm</Link>
      </nav>

      <div className="header-profile">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>{userName || "Guest"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </header>
  );
};

export default Header;
