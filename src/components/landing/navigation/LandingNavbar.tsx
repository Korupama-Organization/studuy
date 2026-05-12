import React from 'react';
import logoImage from '../../../assets/Logo.png';
import { useNavigation } from '../../../contexts/NavigationContext';

const LandingNavbar: React.FC = () => {
  const { goToSlide } = useNavigation();

  return (
    <nav className="relative z-[100] h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-[1280px] h-full mx-auto px-4 xl:px-0">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => goToSlide(0)}>
            <img
              src={logoImage}
              alt="SEeds"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-slate-900">SEeds</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <button 
              className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" 
              onClick={() => goToSlide(5)}
            >
              Tính năng
            </button>
            <button 
              className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" 
              onClick={() => goToSlide(4)}
            >
              Cách hoạt động
            </button>
            <button 
              className="text-[#4A5565] font-medium hover:text-[#4D55CC] transition-colors" 
              onClick={() => goToSlide(8)}
            >
              Dành cho Nhà tuyển dụng
            </button>
          </div>

          <div className="flex items-center gap-8">
            <a className="text-[#4A5565] font-medium hover:text-[#4D55CC]" href="/login">
              Đăng nhập
            </a>
            <a
              className="px-7 py-3 bg-gradient-to-r from-[#C977D6] to-[#7C5CFC] text-white font-semibold rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-[0_4px_14px_rgba(124,92,252,0.4)] hover:shadow-[0_0_20px_rgba(124,92,252,0.6)]"
              href="/register"
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
