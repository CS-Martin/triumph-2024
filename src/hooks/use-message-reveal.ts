import { type RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type MessageRevealOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  fromY: number;
  toY: number;
};

export function useMessageReveal({ sectionRef, titleRef, contentRef, fromY, toY }: MessageRevealOptions) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: '30% top',
          scrub: 1,
        },
      });

      const title = titleRef.current;
      if (title) {
        // Split title into individual characters
        const chars = (title.innerText || '').split('');

        // Clear the original text
        title.innerHTML = '';

        // Wrap each character in a span
        chars.forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = `translateY(${fromY}px)`;
          title.appendChild(span);

          // Character stagger animation: fade-up from below
          tl.to(span, { y: toY, opacity: 1, duration: 3, ease: 'power3.inOut' }, index * 0.06);
        });
      }

      // Text content fade animations
      if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p');

        // Set initial opacity to 0
        gsap.set(paragraphs, { opacity: 0 });

        paragraphs.forEach((p, index) => {
          // Fade in animation
          tl.to(p, { opacity: 1, duration: 1, ease: 'power2.out' }, 18 * 0.06 + index * 0.2);

          // Fade out animation
          tl.to(p, { opacity: 0, duration: 1, ease: 'power2.in' }, 18 * 0.06 + index * 0.2 + 2);
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, titleRef, contentRef, fromY, toY]);
}
