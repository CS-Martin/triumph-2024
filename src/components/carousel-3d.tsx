'use client';

import Image from 'next/image';
import { type TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useViewportWidth } from '@/hooks/use-viewport-width';

export type CarouselItem = {
  key: string;
  name: string;
  image: string;
  description: string;
  programs: string[];
};

type CarouselVariant = 'wide' | 'compact';

type Carousel3DProps = {
  items: CarouselItem[];
  variant?: CarouselVariant;
  getHref?: (key: string) => string;
};

type Size = { width: string; height: string };

const SIZES: Record<CarouselVariant, Record<'center' | 'side', Record<'mobile' | 'desktop', Size>>> = {
  wide: {
    center: {
      mobile: { width: 'clamp(280px, 68vw, 380px)', height: 'clamp(280px, 68vw, 380px)' },
      desktop: { width: 'min(40vw, 500px)', height: 'min(40vw, 500px)' },
    },
    side: {
      mobile: { width: 'clamp(200px, 42vw, 280px)', height: 'clamp(200px, 42vw, 280px)' },
      desktop: { width: 'min(28vw, 360px)', height: 'min(28vw, 360px)' },
    },
  },
  compact: {
    center: {
      mobile: { width: 'clamp(240px, 68vw, 320px)', height: 'clamp(320px, 88vw, 420px)' },
      desktop: { width: 'min(40vw, 500px)', height: 'min(56vw, 620px)' },
    },
    side: {
      mobile: { width: 'clamp(150px, 42vw, 220px)', height: 'clamp(220px, 58vw, 300px)' },
      desktop: { width: 'min(28vw, 360px)', height: 'min(40vw, 470px)' },
    },
  },
};

export function Carousel3D({ items, variant = 'wide', getHref }: Carousel3DProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isZooming, setIsZooming] = useState(false);
  const viewportWidth = useViewportWidth();
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const activeItem = items[activeIndex];
  const isMobile = viewportWidth < 768;
  const spread = variant === 'wide' ? 2 : 1;

  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    };
  }, []);

  const stepToNext = (direction: 1 | -1) => {
    setActiveIndex((prev) => (prev + direction + items.length) % items.length);
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

  const handlePaintingClick = (offset: number, itemKey: string) => {
    if (isZooming) return;

    if (offset !== 0) {
      navigateByOffset(offset);
      return;
    }

    if (!getHref) return;

    setIsZooming(true);
    zoomTimeoutRef.current = setTimeout(() => {
      router.push(getHref(itemKey));
    }, 750);
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

    navigateByOffset(deltaX < 0 ? 1 : -1);

    touchStartXRef.current = null;
  };

  const visibleItems = useMemo(() => {
    const offsets = spread === 2 ? [-2, -1, 0, 1, 2] : [-1, 0, 1];

    return offsets.map((offset) => ({
      index: (activeIndex + offset + items.length) % items.length,
      offset,
    }));
  }, [activeIndex, items.length, spread]);

  const titleWords = activeItem.name.split(' ');
  const titleSplit = Math.ceil(titleWords.length / 2);

  return (
    <section className='relative pt-36 sm:pt-44 md:pt-60 pb-10 px-4 md:px-8'>
      <div className='mx-auto max-w-[1400px]'>
        <motion.div
          className='relative h-[460px] sm:h-[520px] md:h-[640px] flex items-center justify-center'
          style={{ perspective: '1800px' }}
          animate={{
            scale: isZooming ? 1.35 : 1,
            y: isZooming ? -16 : 0,
            opacity: isZooming ? 0.95 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}>
          <AnimatePresence initial={false}>
            {visibleItems.map(({ index, offset }) => {
              const item = items[index];
              const isCenter = offset === 0;
              const isFar = Math.abs(offset) === 2;
              const side = offset < 0 ? 1 : -1;

              const baseTranslate = offset * (isCenter ? 0 : isFar ? (isMobile ? 150 : 380) : isMobile ? 130 : 439);
              const rotateY = isCenter ? 0 : side * (isFar ? (isMobile ? 50 : 56) : isMobile ? 28 : 36);
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
              const { width, height } = SIZES[variant][isCenter ? 'center' : 'side'][isMobile ? 'mobile' : 'desktop'];

              return (
                <motion.button
                  key={item.key}
                  type='button'
                  onClick={() => handlePaintingClick(offset, item.key)}
                  className='absolute'
                  initial={{ x: baseTranslate + slideDirection * 180, opacity: 0 }}
                  animate={{
                    x: isZooming && isCenter ? 0 : baseTranslate,
                    rotateY: isZooming && isCenter ? 0 : rotateY,
                    scale: isZooming && isCenter ? scale * 1.25 : scale,
                    opacity: isZooming && !isCenter ? 0 : opacity,
                  }}
                  exit={{ x: baseTranslate - slideDirection * 180, opacity: 0 }}
                  transition={{ duration: isZooming && isCenter ? 0.7 : 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    zIndex: isZooming && isCenter ? 100 : 10 - Math.abs(offset),
                    width,
                    height,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                  whileHover={{ scale: !isZooming ? scale + 0.03 : scale }}
                  aria-label={`View ${item.name}`}>
                  <div className='relative h-full w-full overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.65)]'>
                    <Image src={item.image} alt={item.name} fill className='cursor-pointer' priority={isCenter} />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div
          className={`mt-2 xl:mt-12 grid grid-cols-1 gap-3 xl:gap-13 items-center ${
            variant === 'wide' ? 'lg:grid-cols-[1.2fr_1fr]' : 'lg:grid-cols-[1fr_1fr]'
          }`}>
          <AnimatePresence mode='wait'>
            <motion.h1
              key={`title-${activeItem.key}`}
              className={`text-[#F4E590] text-center lg:text-right ${variant === 'wide' ? 'leading-[0.9]' : ''}`}
              style={{ fontFamily: 'var(--font-beau-rivage)', fontSize: 'clamp(3rem,7vw,6.2rem)' }}
              initial={{ opacity: 0, x: slideDirection * 50, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: slideDirection * -40, filter: 'blur(4px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              {titleWords.slice(0, titleSplit).join(' ')}
              <br />
              {titleWords.slice(titleSplit).join(' ')}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode='wait'>
            <motion.div
              key={`content-${activeItem.key}`}
              className='text-sm md:text-base text-white/85 max-w-xl'
              initial={{ opacity: 0, x: slideDirection * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection * -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <p className='leading-relaxed'>{activeItem.description}</p>
              <ul className='mt-4 space-y-1 text-white/80'>
                {activeItem.programs.map((program) => (
                  <li key={program}>· {program}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
