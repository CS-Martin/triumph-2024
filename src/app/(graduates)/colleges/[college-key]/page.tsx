'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/nav';
import { useParams } from 'next/navigation';
import { useRef, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'motion/react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { COLLEGE_ID_BY_KEY } from '@convex/lib/colleges';

const BATCH_SIZE = 12;

export default function CollegeGraduatesPage() {
  const params = useParams();
  const collegeKey = params['college-key'] as string;
  const college = COLLEGE_ID_BY_KEY[collegeKey];

  const { results: graduates, status, loadMore } = usePaginatedQuery(
    api.users.index.getByCollegePaginated,
    college === undefined ? 'skip' : { college },
    { initialNumItems: BATCH_SIZE },
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLDivElement>(null);
  const hasMore = status === 'CanLoadMore';

  // Lenis
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  // Convert vertical wheel events into horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Sync plant horizontal position with scroll
  useEffect(() => {
    const el = scrollRef.current;
    const plant = plantRef.current;
    if (!el || !plant) return;
    const updatePlantPosition = () => {
      plant.style.transform = `translateX(-${el.scrollLeft}px)`;
    };
    el.addEventListener('scroll', updatePlantPosition);
    updatePlantPosition();
    return () => el.removeEventListener('scroll', updatePlantPosition);
  }, []);

  // Intersection observer on sentinel to load more
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = scrollRef.current;
    if (!sentinel || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore(BATCH_SIZE);
      },
      { root: container, rootMargin: '0px 300px 0px 0px', threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (college === undefined) {
    return (
      <main className='min-h-screen bg-[#0a0a0a] text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-screen'>
          <p>College not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen  text-white'>
      <Navbar />

      <section className='relative sm:pt-44 md:pt-40 min-h-screen overflow-hidden'>
        <div className='absolute inset-0 w-full h-full pointer-events-none'>
          <Image
            src='/events/university-events-bg.webp'
            alt='University Events Background'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div
          ref={plantRef}
          className='absolute left-[-3%] w-[320px] h-[400px] sm:w-auto sm:h-[1200px] bottom-[-260px] pointer-events-none'>
          <Image src='/events/plant2.webp' height={500} width={500} alt='Plant decoration' className='object-cover' />
        </div>

        <div
          ref={scrollRef}
          className='grid grid-rows-1 sm:grid-rows-2 gap-8 gap-x-15 overflow-x-auto pb-4 scrollbar-hide pl-90'
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            gridAutoFlow: 'column',
            gridAutoColumns: '320px',
          }}>
          {graduates.map((graduate, index) => (
            <Link
              key={graduate._id}
              href={`/colleges/${collegeKey}/${graduate.slug}`}
              className='relative flex flex-col items-center group cursor-pointer justify-self-center'>
              <motion.div
                className='relative w-[320px] h-[400px] sm:w-[300px] sm:h-[400px]'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % BATCH_SIZE) * 0.05 }}>
                <div className='absolute inset-10 overflow-hidden z-0'>
                  {graduate.toga_key ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/r2/files/${graduate.toga_key}`}
                      alt={`${graduate.first_name} ${graduate.last_name}`}
                      className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='w-full h-full bg-white/10 flex items-center justify-center text-white/50 text-sm'>
                      No Image
                    </div>
                  )}
                </div>
                <Image src='/graduates-frame.png' alt='Frame' fill className='pointer-events-none z-10' priority />
              </motion.div>
              <motion.div
                className='mt-4 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: (index % BATCH_SIZE) * 0.05 + 0.2 }}>
                <h3
                  className='text-[#F4E590] text-base group-hover:text-white transition-colors'
                  style={{ fontFamily: 'var(--font-rosarivo)' }}>
                  {graduate.last_name}, {graduate.first_name}
                </h3>
                <p className='text-white/80 text-sm mt-1'>{graduate.program}</p>
              </motion.div>
            </Link>
          ))}

          {status === 'LoadingFirstPage' && (
            <div className='w-[320px] h-[400px] bg-white/5 animate-pulse' />
          )}

          {hasMore && <div ref={sentinelRef} className='w-1' aria-hidden='true' />}
        </div>
      </section>
    </main>
  );
}
