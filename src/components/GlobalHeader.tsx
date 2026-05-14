import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GlobalHeaderProps {
  userName?: string;
  links?: { to: string; label: string }[];
}

export default function GlobalHeader({
  userName = 'Nguyễn Văn A',
  links = [
    { to: '/candidate/dashboard', label: 'Bảng điều khiển' },
    { to: '#', label: 'Phỏng vấn thử' },
    { to: '/candidate/jobs', label: 'Việc làm' },
  ],
}: GlobalHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className="global-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="SEeds home">
            <div className="brand-icon">S</div>
            <span className="brand-name">SEeds</span>
          </Link>

          <nav className="nav-links">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className="nav-link">
                {l.label}
              </Link>
            ))}

            <div className="user-menu">
              <button
                className="user-trigger"
                onClick={() => setDropdownOpen((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8242 17.4898V15.8241C15.8242 14.9405 15.4732 14.0932 14.8485 13.4684C14.2237 12.8437 13.3763 12.4927 12.4928 12.4927H7.49571C6.61216 12.4927 5.76481 12.8437 5.14005 13.4684C4.51529 14.0932 4.16431 14.9405 4.16431 15.8241V17.4898" stroke="#364153" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.99424 9.16133C11.8341 9.16133 13.3256 7.66982 13.3256 5.82994C13.3256 3.99005 11.8341 2.49854 9.99424 2.49854C8.15436 2.49854 6.66284 3.99005 6.66284 5.82994C6.66284 7.66982 8.15436 9.16133 9.99424 9.16133Z" stroke="#364153" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="user-name">{userName}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.9959 9.99665L7.99725 5.99798L3.99857 9.99665" stroke="#364153" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown" role="menu">
                  <a href="#" className="dd-item">Hồ sơ</a>
                  <a href="#" className="dd-item">Quản lý tài khoản</a>
                  <div className="dd-divider" />
                  <button className="dd-item dd-logout">Đăng xuất</button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <style>{`
        .global-header { background: #FFF; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index:60; }
        .header-inner { max-width:1400px; margin:0 auto; padding:0 1.5rem; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .brand { display:flex; align-items:center; gap:8px; text-decoration:none; color:inherit; }
        .brand-icon { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#4D55CC,#8B4CFF); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .brand-name { font-weight:700; font-size:20px; background:linear-gradient(90deg,#4D55CC,#8B4CFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-links { display:flex; align-items:center; gap:1.5rem; }
        .nav-link { color:#364153; text-decoration:none; font-weight:500; }
        .user-menu { position:relative; }
        .user-trigger { display:flex; align-items:center; gap:8px; background:none; border:0; padding:8px 10px; border-radius:8px; cursor:pointer; }
        .user-trigger:hover { background:#F3F4F6; }
        .user-dropdown { position:absolute; right:0; top:calc(100% + 8px); width:220px; background:#fff; border:1px solid #E5E7EB; border-radius:8px; padding:8px 0; box-shadow:0 10px 15px -3px rgba(0,0,0,.1); }
        .dd-item { display:block; padding:10px 16px; color:#364153; text-decoration:none; }
        .dd-item:hover { background:#F9FAFB; }
        .dd-divider { height:1px; background:#F3F4F6; margin:6px 0; }
        .dd-logout { width:100%; text-align:left; color:#E7000B; border:0; background:none; padding:10px 16px; }
      `}</style>
    </>
  );
}
