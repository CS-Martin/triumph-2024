import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NavigationDotsProps {
  totalSections: number;
  currentSection: number;
  onSectionClick: (index: number) => void;
}

export function NavigationDots({ totalSections, currentSection, onSectionClick }: NavigationDotsProps) {
  const dotsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    // Animate active dot - grow from left to right
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        if (index === currentSection) {
          gsap.to(dot, {
            width: '3rem',
            duration: 0.01,
            ease: 'power2.out'
          });
        } else {
          gsap.to(dot, {
            width: '0.3rem',
            duration: 0.01,
            ease: 'power2.out'
          });
        }
      }
    });
  }, [currentSection]);

  const handleDotClick = (index: number) => {
    onSectionClick(index);

    // Animate dot click
    if (dotsRef.current[index]) {
      gsap.to(dotsRef.current[index], {
        scale: 3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div className="fixed left-32 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-8">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          ref={el => {
            if (el) dotsRef.current[index] = el;
          }}
          onClick={() => handleDotClick(index)}
          className="h-1 bg-white rounded-full cursor-pointer transition-all duration-700"
          style={{ width: '0.3rem' }}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
}
