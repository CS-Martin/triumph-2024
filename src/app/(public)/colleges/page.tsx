'use client';

import Image from 'next/image';
import { type TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from '@/components/layout/nav';
import { AnimatePresence, motion } from 'framer-motion';

type CollegeItem = {
  key: string;
  name: string;
  image: string;
  description: string;
  programs: string[];
};

const colleges: CollegeItem[] = [
  {
    key: 'computer-studies',
    name: 'College Of Computer Studies',
    image: '/colleges/computer-studies.png',
    description:
      'Standing at the intersection of logic and imagination, this academic community brings together programmers who design systems that shape the future and artists and animators who give life to digital worlds.',
    programs: [
      'BS Digital Illustration & Animation',
      'BS Information Technology',
      'BS Information Systems',
      'BS Computer Science',
    ],
  },
  {
    key: 'business-and-accountancy',
    name: 'College Of Business And Accountancy',
    image: '/colleges/business-and-accountancy.png',
    description:
      'A hub for future entrepreneurs and financial leaders, this college nurtures strategic thinking, ethical leadership, and practical business acumen.',
    programs: ['BS Accountancy', 'BS Management Accounting', 'BS Business Administration'],
  },
  {
    key: 'education',
    name: 'College Of Education',
    image: '/colleges/education.png',
    description:
      'Preparing mission-driven educators and mentors, this college develops professionals committed to transformative, learner-centered teaching.',
    programs: ['BEEd', 'BSEd', 'BTLEd'],
  },
  {
    key: 'graduate-school',
    name: 'Graduate School',
    image: '/colleges/graduate-school.png',
    description:
      'Advanced and interdisciplinary learning for professionals and researchers who seek deeper expertise and meaningful impact in their fields.',
    programs: ["Master's Programs", 'Doctoral Programs', 'Professional Tracks'],
  },
  {
    key: 'humanities-and-social-science',
    name: 'College Of Humanities And Social Science',
    image: '/colleges/humanities-and-social-science.png',
    description:
      'Rooted in human experience and social realities, this college fosters critical inquiry, communication, and civic engagement.',
    programs: ['AB Communication', 'AB Political Science', 'AB Psychology'],
  },
  {
    key: 'law',
    name: 'College Of Law',
    image: '/colleges/law.png',
    description:
      'Forming principled advocates and servant-leaders in the legal profession through rigorous scholarship and social justice orientation.',
    programs: ['Juris Doctor'],
  },
  {
    key: 'nursing',
    name: 'College Of Nursing',
    image: '/colleges/nursing.png',
    description:
      'A formation space for compassionate, globally competent healthcare professionals dedicated to service and holistic care.',
    programs: ['BS Nursing'],
  },
  {
    key: 'science-engineering-architecture',
    name: 'College Of Science, Engineering, And Architecture',
    image: '/colleges/science-engineering-architecture.png',
    description:
      'An innovation-driven environment where scientific rigor, engineering precision, and design thinking converge.',
    programs: ['BS Architecture', 'Engineering Programs', 'Science Programs'],
  },
];

export default function CollegesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const activeCollege = colleges[activeIndex];
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);

      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

  const stepToNext = (direction: 1 | -1) => {
    setActiveIndex((prev) => (prev + direction + colleges.length) % colleges.length);
  };

  const navigateByOffset = (offset: number) => {
    if (offset === 0) return;

    const direction: 1 | -1 = offset > 0 ? 1 : -1;
    const steps = Math.abs(offset);

    setSlideDirection(direction);

    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }

    stepToNext(direction);

    if (steps === 2) {
      stepTimeoutRef.current = setTimeout(() => {
        stepToNext(direction);
      }, 320);
    }
  };

  const handlePaintingClick = (offset: number) => {
    navigateByOffset(offset);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;

    if (startX == null || endX == null) return;

    const deltaX = endX - startX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX < 0) {
      navigateByOffset(1);
    } else {
      navigateByOffset(-1);
    }

    touchStartXRef.current = null;
  };

  const visibleItems = useMemo(() => {
    const prev2 = (activeIndex - 2 + colleges.length) % colleges.length;
    const prev1 = (activeIndex - 1 + colleges.length) % colleges.length;
    const next1 = (activeIndex + 1) % colleges.length;
    const next2 = (activeIndex + 2) % colleges.length;

    return [
      { index: prev2, offset: -2 },
      { index: prev1, offset: -1 },
      { index: activeIndex, offset: 0 },
      { index: next1, offset: 1 },
      { index: next2, offset: 2 },
    ];
  }, [activeIndex]);

  return (
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <section className='relative pt-36 sm:pt-44 md:pt-60 pb-10 px-4 md:px-8'>
        <div className='mx-auto max-w-[1400px]'>
          <div
            className='relative h-[460px] sm:h-[520px] md:h-[640px] flex items-center justify-center perspective-[1800px]'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            <AnimatePresence initial={false}>
              {visibleItems.map(({ index, offset }) => {
                const item = colleges[index];
                const isCenter = offset === 0;
                const isFar = Math.abs(offset) === 2;

                const baseTranslate = offset * (isCenter ? 0 : isFar ? (isMobile ? 150 : 380) : isMobile ? 130 : 439);
                const rotateY = isCenter
                  ? 0
                  : isFar
                    ? offset < 0
                      ? isMobile
                        ? 50
                        : 56
                      : isMobile
                        ? -50
                        : -56
                    : offset < 0
                      ? isMobile
                        ? 28
                        : 36
                      : isMobile
                        ? -28
                        : -36;
                const scale = isCenter
                  ? isMobile
                    ? 1.08
                    : 1.06
                  : isFar
                    ? isMobile
                      ? 0.86
                      : 0.8
                    : isMobile
                      ? 0.96
                      : 0.92;
                const opacity = isCenter ? 1 : isFar ? (isMobile ? 0.78 : 0.68) : isMobile ? 0.95 : 0.9;
                const width = isCenter
                  ? isMobile
                    ? 'clamp(240px, 68vw, 320px)'
                    : 'min(40vw, 500px)'
                  : isMobile
                    ? 'clamp(150px, 42vw, 220px)'
                    : 'min(28vw, 360px)';
                const height = isCenter
                  ? isMobile
                    ? 'clamp(320px, 88vw, 420px)'
                    : 'min(56vw, 620px)'
                  : isMobile
                    ? 'clamp(220px, 58vw, 300px)'
                    : 'min(40vw, 470px)';

                return (
                  <motion.button
                    key={item.key}
                    type='button'
                    onClick={() => handlePaintingClick(offset)}
                    className='absolute'
                    initial={{ x: baseTranslate + slideDirection * 180, opacity: 0 }}
                    animate={{
                      x: baseTranslate,
                      rotateY,
                      scale,
                      opacity,
                    }}
                    exit={{ x: baseTranslate - slideDirection * 180, opacity: 0 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      zIndex: 10 - Math.abs(offset),
                      width,
                      height,
                      transformStyle: 'preserve-3d',
                      willChange: 'transform, opacity',
                    }}
                    whileHover={{ scale: scale + 0.03 }}
                    aria-label={`View ${item.name}`}>
                    <div className='relative h-full w-full overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.65)]'>
                      <Image src={item.image} alt={item.name} fill className='cursor-pointer' priority={isCenter} />
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className='mt-2 xl:mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-3 xl:gap-13 items-center'>
            <AnimatePresence mode='wait'>
              <motion.h1
                key={`title-${activeCollege.key}`}
                className='text-[#F4E590] leading-[0.9] text-center lg:text-right'
                style={{ fontFamily: 'var(--font-beau-rivage)', fontSize: 'clamp(3rem,7vw,6.2rem)' }}
                initial={{ opacity: 0, x: slideDirection * 50, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: slideDirection * -40, filter: 'blur(4px)' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
                {activeCollege.name
                  .split(' ')
                  .slice(0, Math.ceil(activeCollege.name.split(' ').length / 2))
                  .join(' ')}
                <br />
                {activeCollege.name
                  .split(' ')
                  .slice(Math.ceil(activeCollege.name.split(' ').length / 2))
                  .join(' ')}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode='wait'>
              <motion.div
                key={`content-${activeCollege.key}`}
                className='text-sm md:text-base text-white/85 max-w-xl'
                initial={{ opacity: 0, x: slideDirection * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className='leading-relaxed'>{activeCollege.description}</p>
                <ul className='mt-4 space-y-1 text-white/80'>
                  {activeCollege.programs.map((program) => (
                    <li key={program}>· {program}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
