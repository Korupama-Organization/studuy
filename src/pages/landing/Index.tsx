import React, { useEffect, useState } from 'react';
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
      <LandingNavbar />

      <main className="flex flex-col w-full">
        <HeroSection />
        <ProblemSection />
        <PainSection />
        <SolutionSection />
        <HowItWorksSection />
        <AIAnalysisSection />
        <ValueSection />
        <JobConnectionSection />
        <RecruiterSection />
        <DemoSection />
        <CTASection />
        <FAQSection />
        <FooterSection />
      </main>
    </div>
  );
};

export default LandingPage;
