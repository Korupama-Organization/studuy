import React, { useEffect, useRef, useState } from 'react';
import {
  AIAnalysisSection,
  CTASection,
  DemoSection,
  FAQSection,
  FooterSection,
  HeroSection,
  HowItWorksSection,
  JobConnectionSection,
  LandingNavbar,
  PainSection,
  ProblemSection,
  RecruiterSection,
  SolutionSection,
  ValueSection,
} from '../../components/landing';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';

import { NavigationContext } from '../../contexts/NavigationContext';

// Slide labels for indicator tooltips
const SLIDE_LABELS = [
  'Hero',
  'Vấn đề',
  'Nỗi đau',
  'Giải pháp',
  'Cách hoạt động',
  'Phân tích AI',
  'Giá trị',
  'Kết nối việc làm',
  'Nhà tuyển dụng',
  'Demo',
  'Bắt đầu',
  'FAQ',
  'Footer',
];

const SECTION_COMPONENTS = [
  HeroSection,
  ProblemSection,
  PainSection,
  SolutionSection,
  HowItWorksSection,
  AIAnalysisSection,
  ValueSection,
  JobConnectionSection,
  RecruiterSection,
  DemoSection,
  CTASection,
  FAQSection,
  FooterSection,
];

const LandingPage: React.FC = () => {
  const [isDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // slideTrackRef points to the .slide-track div — the hook translates it via CSS transform
  const slideTrackRef = useRef<HTMLDivElement>(null);
  const mobileMainRef = useRef<HTMLDivElement>(null);

  const { currentSlide, totalSlides, goToSlide, isSlideMode } = useSlideNavigation(slideTrackRef);

  // ── Dark mode ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // ── Add/remove slide-mode class on <html> ───────────────────────────
  useEffect(() => {
    if (isSlideMode) {
      document.documentElement.classList.add('slide-mode');
    } else {
      document.documentElement.classList.remove('slide-mode');
    }
    return () => document.documentElement.classList.remove('slide-mode');
  }, [isSlideMode]);

  // ── Mobile: IntersectionObserver for reveal animations ──────────────
  useEffect(() => {
    if (isSlideMode) return;

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
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
      { rootMargin: '0px 0px -12% 0px', threshold: 0.14 }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isSlideMode]);

  const progressWidth = totalSlides > 1 ? `${((currentSlide + 1) / totalSlides) * 100}%` : '8%';
  const totalDots = totalSlides || SECTION_COMPONENTS.length;

  const contextValue = { goToSlide, isSlideMode };

  // ── Desktop slide mode ──────────────────────────────────────────────
  if (isSlideMode) {
    return (
      <NavigationContext.Provider value={contextValue}>
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
          {/* Top progress bar */}
          <div className="slide-progress" style={{ width: progressWidth }} />

          {/* Fixed Navbar — z-index above slide container */}
          <LandingNavbar />

          {/* Fixed slide container — starts below navbar (top: 80px set in CSS) */}
          <div className="slide-container">
            {/* Track: translated by the hook to show the current slide */}
            <div ref={slideTrackRef} className="slide-track">
              {SECTION_COMPONENTS.map((SectionComponent, i) => (
                <div
                  key={i}
                  data-slide={i}
                  className="slide-wrapper"
                >
                  <SectionComponent />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators — fixed to the right edge */}
          <nav className="slide-indicators" aria-label="Slide navigation">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                className={`slide-dot${currentSlide === i ? ' active' : ''}`}
                onClick={() => goToSlide(i)}
                title={SLIDE_LABELS[i] ?? `Slide ${i + 1}`}
                aria-label={SLIDE_LABELS[i] ?? `Slide ${i + 1}`}
                aria-current={currentSlide === i ? 'true' : undefined}
              />
            ))}
          </nav>
        </div>
      </NavigationContext.Provider>
    );
  }

  // ── Mobile / tablet — normal scroll ───────────────────────────────
  return (
    <NavigationContext.Provider value={contextValue}>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
        <LandingNavbar />
        <main ref={mobileMainRef} className="flex flex-col w-full">
          {SECTION_COMPONENTS.map((SectionComponent, i) => (
            <div key={i} data-slide={i}>
              <SectionComponent />
            </div>
          ))}
        </main>
      </div>
    </NavigationContext.Provider>
  );
};

export default LandingPage;
