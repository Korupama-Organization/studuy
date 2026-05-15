import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../../services/auth";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const initials = userName
    .split(" ")
    .slice(-2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="dashboard-header">
      {/* Logo */}
      <Link to="/" className="header-logo">
        <div className="header-logo-icon">SE</div>
        SEeds
      </Link>

      {/* Nav */}
      <nav className="header-nav">
        <Link to="/dashboard" className="header-link active">Bảng điều khiển</Link>
        <Link to="/jobs" className="header-link">Việc làm</Link>
        <Link to="/profile" className="header-link">Hồ sơ</Link>
      </nav>

      {/* Profile */}
      <div className="header-profile" style={{ cursor: "default" }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
          {userName || "Ứng viên"}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#ef4444", padding: "0 0.25rem",
            display: "flex", alignItems: "center",
          }}
          title="Đăng xuất"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
