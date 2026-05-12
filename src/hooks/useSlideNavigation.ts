import { useCallback, useEffect, useRef, useState } from 'react';

/** Time (ms) the CSS slide transition takes — must match .slide-track transition duration */
const TRANSITION_MS = 750;
const DESKTOP_BREAKPOINT = 1024;
const SLIDE_HEIGHT_VAR = 'calc(100vh - 80px)'; // 80px = navbar height

export interface UseSlideNavigationReturn {
  currentSlide: number;
  totalSlides: number;
  goToSlide: (index: number) => void;
  isSlideMode: boolean;
}

/**
 * Resets and replays [data-reveal] animations within a slide element.
 * Called AFTER the slide transition finishes so elements are in view.
 */
function replayRevealAnimations(slideEl: HTMLElement): void {
  const revealEls = Array.from(slideEl.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!revealEls.length) return;

  // 1. Remove is-visible to reset opacity/translate
  revealEls.forEach((el) => el.classList.remove('is-visible'));

  // 2. Force reflow so browser registers the class removal
  void slideEl.offsetHeight;

  // 3. Add is-visible back in next paint → CSS transition fires
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    });
  });
}

/**
 * useSlideNavigation
 *
 * trackRef — ref to the .slide-track element.
 * The hook translates the track vertically via CSS transform to show one slide at a time.
 */
export function useSlideNavigation(
  trackRef: React.RefObject<HTMLElement | null>
): UseSlideNavigationReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isSlideMode, setIsSlideMode] = useState(false);

  const isTransitioning = useRef(false);
  const currentSlideRef = useRef(0);
  const totalSlidesRef = useRef(0);

  // Keep refs in sync with state for use inside event handlers
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);
  useEffect(() => { totalSlidesRef.current = totalSlides; }, [totalSlides]);

  /** Apply transform to move the track to the given slide index. */
  const applyTransform = useCallback((index: number) => {
    if (!trackRef.current) return;
    // Each slide is (100vh - 80px) tall because the container starts below the 80px navbar
    trackRef.current.style.transform = `translateY(calc(${-index} * ${SLIDE_HEIGHT_VAR}))`;
  }, [trackRef]);

  const getSlides = useCallback((): HTMLElement[] => {
    if (isSlideMode && trackRef.current) {
      return Array.from(trackRef.current.querySelectorAll<HTMLElement>('[data-slide]'));
    }
    // Mobile mode fallback
    return Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'));
  }, [trackRef, isSlideMode]);

  const navigateTo = useCallback(
    (index: number) => {
      const slides = getSlides();
      if (!slides.length) return;

      const clamped = Math.max(0, Math.min(index, slides.length - 1));
      
      // Mobile Mode (no transform, just smooth scroll)
      if (!isSlideMode) {
        slides[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Slide Mode logic
      if (clamped === currentSlideRef.current && isTransitioning.current) return;

      isTransitioning.current = true;
      setCurrentSlide(clamped);
      currentSlideRef.current = clamped;

      // Move track to the target slide via CSS transform
      applyTransform(clamped);

      // After the slide transition finishes, replay animations for the new slide
      setTimeout(() => {
        replayRevealAnimations(slides[clamped]);
        isTransitioning.current = false;
      }, TRANSITION_MS);
    },
    [getSlides, applyTransform]
  );

  // ── Init: detect viewport and count slides ──────────────────────────
  useEffect(() => {
    const checkMode = () => setIsSlideMode(window.innerWidth >= DESKTOP_BREAKPOINT);
    checkMode();
    window.addEventListener('resize', checkMode);
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  useEffect(() => {
    const slides = getSlides();
    setTotalSlides(slides.length);
    totalSlidesRef.current = slides.length;
  }, [getSlides, isSlideMode]); // re-count when mode changes (DOM re-renders)

  // ── Play first slide's animations immediately on mount ──────────────
  useEffect(() => {
    if (!isSlideMode || !trackRef.current) return;

    // Ensure track starts at position 0
    applyTransform(0);

    const firstSlide = trackRef.current.querySelector<HTMLElement>('[data-slide="0"]');
    if (!firstSlide) return;

    // Small delay so CSS transition is already set up before we add is-visible
    const t = setTimeout(() => {
      replayRevealAnimations(firstSlide);
    }, 100);
    return () => clearTimeout(t);
  }, [isSlideMode, trackRef, applyTransform]);

  // ── Keyboard navigation ─────────────────────────────────────────────
  useEffect(() => {
    if (!isSlideMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        navigateTo(currentSlideRef.current + 1);
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        navigateTo(currentSlideRef.current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideMode, navigateTo]);

  // ── Wheel / touchpad navigation ─────────────────────────────────────
  useEffect(() => {
    if (!isSlideMode) return;

    let accumulatedDelta = 0;
    const DELTA_THRESHOLD = 50;
    let resetTimer: number;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;

      accumulatedDelta += e.deltaY;

      clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => { accumulatedDelta = 0; }, 400);

      if (Math.abs(accumulatedDelta) >= DELTA_THRESHOLD) {
        const direction = accumulatedDelta > 0 ? 1 : -1;
        accumulatedDelta = 0;
        navigateTo(currentSlideRef.current + direction);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(resetTimer);
    };
  }, [isSlideMode, navigateTo]);

  return { currentSlide, totalSlides, goToSlide: navigateTo, isSlideMode };
}
