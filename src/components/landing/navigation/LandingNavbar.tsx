import React from 'react';
import logoImage from '../../../assets/Logo.png';

const LandingNavbar: React.FC = () => {
  return (
    <nav className="relative z-[100] h-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1280px] h-full mx-auto px-4 xl:px-0">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="SEeds"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-slate-900">SEeds</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">
              Tính năng
            </a>
            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">
              Cách hoạt động
            </a>
            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" href="#">
              Dành cho Nhà tuyển dụng
            </a>
          </div>

          <div className="flex items-center gap-8">
            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC]" href="#">
              Đăng nhập
            </a>
            <a
              className="px-7 py-3 bg-gradient-to-r from-[#C977D6] to-[#7C5CFC] text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(124,92,252,0.4)]"
              href="#"
            >
              Bắt đầu ngay
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
