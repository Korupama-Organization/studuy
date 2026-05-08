import React, { useEffect, useState } from 'react';
import HeroSection from '../../components/HeroSection';
import ProblemSection from '../../components/ProblemSection';
import PainSection from '../../components/PainSection';
import SolutionSection from '../../components/SolutionSection';
import HowItWorksSection from '../../components/HowItWorksSection';
import FeaturesSection from '../../components/FeaturesSection';
import DemoSection from '../../components/DemoSection';
import CTASection from '../../components/CTASection';
import FAQSection from '../../components/FAQSection';
import FooterSection from '../../components/FooterSection';
import logoImage from '../../assets/Logo.png';
import '../../styles/landing/FormalMotion.css';

const LandingPage: React.FC = () => {
  const [isDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14,
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
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

      <main className="flex flex-col w-full">
        <HeroSection />
        <ProblemSection />
        <PainSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DemoSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default LandingPage;
