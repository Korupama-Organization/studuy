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

// Slide labels for indicator tooltips (no footer here)
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

  const { currentSlide, totalSlides, goToSlide, isSlideMode, isAtEnd } = useSlideNavigation(slideTrackRef);

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

  const contentSlideCount = SECTION_COMPONENTS.length;
  // When past the last content slide, we're at the footer (progress = 100%)
  const effectiveSlide = Math.min(currentSlide, contentSlideCount - 1);
  const progressWidth = totalSlides > 1 ? `${((effectiveSlide + 1) / contentSlideCount) * 100}%` : '8%';

  const contextValue = { goToSlide, isSlideMode };

  // ── Manage html class for footer mode ─────────────────────────────
  // When at end, remove overflow:hidden so footer flows naturally
  useEffect(() => {
    const html = document.documentElement;
    if (isSlideMode && isAtEnd) {
      html.classList.remove('slide-mode');
      html.classList.add('footer-mode');
    } else if (isSlideMode) {
      html.classList.add('slide-mode');
      html.classList.remove('footer-mode');
    } else {
      html.classList.remove('slide-mode', 'footer-mode');
    }
    return () => html.classList.remove('slide-mode', 'footer-mode');
  }, [isSlideMode, isAtEnd]);

  // ── Desktop slide mode ──────────────────────────────────────────────
  if (isSlideMode) {
    return (
      <NavigationContext.Provider value={contextValue}>
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative min-h-screen">
          {/* Top progress bar — hidden when at end */}
          {!isAtEnd && <div className="slide-progress" style={{ width: progressWidth }} />}

          {/* Fixed Navbar */}
          <LandingNavbar />

          {/* Slide container — released from fixed when at end so footer flows naturally */}
          <div className={`slide-container${isAtEnd ? ' slide-container--released' : ''}`}>
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

          {/* Footer — always in DOM, flows naturally below slide-container when released */}
          <FooterSection />

          {/* Dot indicators — only for content slides, hidden at end */}
          {!isAtEnd && (
            <nav className="slide-indicators" aria-label="Slide navigation">
              {Array.from({ length: contentSlideCount }).map((_, i) => (
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
          )}
        </div>
      </NavigationContext.Provider>
    );
  }

  // ── Mobile / tablet — normal scroll ───────────────────────────────
  return (
    <NavigationContext.Provider value={contextValue}>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
        <LandingNavbar />
        <main ref={mobileMainRef} className="flex flex-col w-full pt-16 md:pt-20">
          {SECTION_COMPONENTS.map((SectionComponent, i) => (
            <div key={i} data-slide={i}>
              <SectionComponent />
            </div>
          ))}
        </main>
        {/* Footer renders naturally after content sections */}
        <FooterSection />
      </div>
    </NavigationContext.Provider>
  );
};

export default LandingPage;
