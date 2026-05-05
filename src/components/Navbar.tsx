import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 2rem',
      height: '77px',
      borderBottom: '1px solid #F3F4F6',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1280px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4D55CC 0%, #8B4CFF 100%)',
          }}></div>
          <span style={{
            color: '#101828',
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
          }}>
            TopCV
          </span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#" style={{ color: '#4A5565', textDecoration: 'none', fontSize: '16px' }}>Tính năng</a>
          <a href="#" style={{ color: '#4A5565', textDecoration: 'none', fontSize: '16px' }}>Cách hoạt động</a>
          <a href="#" style={{ color: '#4A5565', textDecoration: 'none', fontSize: '16px' }}>Dành cho Nhà tuyển dụng</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/login" style={{ color: '#4A5565', textDecoration: 'none', fontSize: '16px' }}>Đăng nhập</a>
          <a href="/register" style={{
            padding: '10px 22px',
            color: '#FFF',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #E484EB 0%, #8B4CFF 100%)',
            textDecoration: 'none',
          }}>
            Bắt đầu ngay
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
