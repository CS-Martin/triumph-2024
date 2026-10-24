import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export function useScrollAnimation(totalSections: number = 3) {
  const mainRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  // Progress is a ref so scrolling never re-renders the page (and the 3D canvas under it)
  const progress = useRef(0);
  const [currentSection, setCurrentSection] = useState(0);

  const currentSectionRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollToSectionRef = useRef<((index: number) => void) | null>(null);

  const scrollToSection = useCallback((index: number) => {
    if (scrollToSectionRef.current) {
      scrollToSectionRef.current(index);
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section', mainRef.current);

      // Scene animation — moves the fixed canvas container left/right
      gsap
        .timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
              progress.current = self.progress;

              // Update current section based on progress
              const sectionIndex = Math.floor(self.progress * totalSections);
              if (sectionIndex !== currentSectionRef.current && sectionIndex < totalSections) {
                currentSectionRef.current = sectionIndex;
                setCurrentSection(sectionIndex);
              }
            },
          },
        })
        .to(sceneRef.current, {
          ease: 'none',
          x: '25vw',
        })
        .to(sceneRef.current, {
          ease: 'none',
          x: '-25vw',
        });

      scrollToSectionRef.current = (index: number) => {
        if (index < 0 || index >= totalSections) return;

        isScrollingRef.current = true;
        currentSectionRef.current = index;
        setCurrentSection(index);

        gsap.to(window, {
          scrollTo: { y: sections[index], autoKill: false },
          duration: 1.5,
          ease: 'power2.in',
          onComplete: () => {
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 100);
          },
        });
      };
    }, mainRef);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollToSectionRef.current?.(currentSectionRef.current + direction);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      scrollToSectionRef.current?.(currentSectionRef.current + (delta > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      ctx.revert();
    };
  }, [totalSections]);

  return { mainRef, sceneRef, progress, currentSection, scrollToSection };
}
