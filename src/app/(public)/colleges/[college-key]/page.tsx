'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/nav';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import Lenis from 'lenis';

type GraduateItem = {
  id: string;
  name: string;
  title: string;
  image: string;
};

const collegesGraduatesData: Record<string, { collegeName: string; graduates: GraduateItem[] }> = {
  'computer-studies': {
    collegeName: 'College Of Computer Studies',
    graduates: [
      {
        id: '1',
        name: 'ABAWAG, JAMES MARCEL A.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Abawag, James Marcel A..webp',
      },
      {
        id: '2',
        name: 'AGRAVANTE, MARL VINCENT C.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Agravante, Marl Vincent C..webp',
      },
      {
        id: '3',
        name: 'ALFONSO, ARIEL DOMINIC A.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Alfonso, Ariel Dominic A..webp',
      },
      {
        id: '4',
        name: 'BARTOLOME, EL JON JOSHUA G.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Bartolome, El Jon Joshua G..webp',
      },
      {
        id: '5',
        name: 'BETITO, JOSEPH RAPHAEL L.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Betito, Joseph Raphael L..webp',
      },
      {
        id: '6',
        name: 'CATORCE, HENRY JR. D.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Catorce, Henry Jr. D..webp',
      },
      {
        id: '7',
        name: 'CHUA, WILLIAN B.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Chua, Willian B..webp',
      },
      {
        id: '8',
        name: 'FERNANDEZ, JERU KIAN C.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Fernandez, Jeru Kian C..webp',
      },
      {
        id: '9',
        name: 'GUERRERO, MARK JOSEPH R.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Guerrero, Mark Joseph R..webp',
      },
      {
        id: '10',
        name: 'LAGTO, SEAN REVON F.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Lagto, Sean Revon F..webp',
      },
      {
        id: '11',
        name: 'MANGUNAY, XIER GABRIEL M.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Mangunay, Xier Gabriel M..webp',
      },
      {
        id: '12',
        name: 'MARIANO, MARC THOMAS F.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Mariano, Marc Thomas F..webp',
      },
      {
        id: '13',
        name: 'NABUS, KENRICK JOHN HARVELL B.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Nabus, Kenrick John Harvell B..webp',
      },
      {
        id: '14',
        name: 'PALMA, KYLE JAMES G.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Palma, Kyle James G..webp',
      },
      {
        id: '15',
        name: 'PEREZ, MA. LOUISA A.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Perez, Ma. Louisa A..webp',
      },
      {
        id: '16',
        name: 'REMOS, MARY ANGELETTE M.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Remos, Mary Angelette M..webp',
      },
      {
        id: '17',
        name: 'TORDILLA, ALECZIA S.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Tordilla, Aleczia S..webp',
      },
      {
        id: '18',
        name: 'VIDOLA, JAMES EDWARD Q.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Vidola, James Edward Q..webp',
      },
      {
        id: '19',
        name: 'VILLASANTA, RAMONCITO D.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Villasanta, Ramoncito D.webp',
      },
      {
        id: '20',
        name: 'VIOLA, PAUL ENRICO N.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Viola, Paul Enrico N..webp',
      },
      {
        id: '21',
        name: 'WOOD, MATTHEW ETHAN G.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Wood, Matthew Ethan G..webp',
      },
    ],
  },
  'business-and-accountancy': {
    collegeName: 'College Of Business And Accountancy',
    graduates: [
      {
        id: '3',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-3.png',
      },
      {
        id: '4',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-4.png',
      },
    ],
  },
  education: {
    collegeName: 'College Of Education',
    graduates: [
      {
        id: '5',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-5.png',
      },
      {
        id: '6',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-6.png',
      },
    ],
  },
  'graduate-school': {
    collegeName: 'Graduate School',
    graduates: [
      {
        id: '7',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-7.png',
      },
    ],
  },
  'humanities-and-social-science': {
    collegeName: 'College Of Humanities And Social Science',
    graduates: [
      {
        id: '8',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-8.png',
      },
    ],
  },
  law: {
    collegeName: 'College Of Law',
    graduates: [
      {
        id: '1',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-1.png',
      },
    ],
  },
  nursing: {
    collegeName: 'College Of Nursing',
    graduates: [
      {
        id: '2',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
    ],
  },
  'science-engineering-architecture': {
    collegeName: 'College Of Science, Engineering, And Architecture',
    graduates: [
      {
        id: '3',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-3.png',
      },
    ],
  },
};

const BATCH_SIZE = 8;

export default function CollegeGraduatesPage() {
  const params = useParams();
  const collegeKey = params['college-key'] as string;
  const collegeData = collegesGraduatesData[collegeKey];

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLDivElement>(null);

  const allGraduates = collegeData?.graduates ?? [];
  const visibleGraduates = allGraduates.slice(0, visibleCount);
  const hasMore = visibleCount < allGraduates.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allGraduates.length));
  }, [allGraduates.length]);

  // Lenis
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: any) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
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

    return () => {
      el.removeEventListener('wheel', onWheel);
    };
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

    return () => {
      el.removeEventListener('scroll', updatePlantPosition);
    };
  }, []);

  // Intersection observer on sentinel element to load more graduates
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = scrollRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { root: container, rootMargin: '0px 300px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (!collegeData) {
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

        {/* Plant decoration at bottom-left of page */}
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
          {visibleGraduates.map((graduate) => (
            <Link
              key={graduate.id}
              href={`/colleges/${collegeKey}/${graduate.id}`}
              className='relative flex flex-col items-center group cursor-pointer justify-self-center'>
              <div className='relative w-[320px] h-[400px] sm:w-[300px] sm:h-[400px]'>
                <div className='absolute inset-10 overflow-hidden z-0'>
                  {graduate.image ? (
                    <img
                      src={graduate.image}
                      alt={graduate.name}
                      className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='w-full h-full bg-white/10 flex items-center justify-center text-white/50 text-sm'>
                      No Image
                    </div>
                  )}
                </div>
                <Image src='/graduates-frame.png' alt='Frame' fill className='pointer-events-none z-10' priority />
              </div>
              <div className='mt-4 text-center'>
                <h3
                  className='text-[#F4E590] text-base group-hover:text-white transition-colors'
                  style={{ fontFamily: 'var(--font-rosarivo)' }}>
                  {graduate.name}
                </h3>
                <p className='text-white/80 text-sm mt-1'>{graduate.title}</p>
              </div>
            </Link>
          ))}

          {/* Sentinel element to trigger loading more */}
          {hasMore && <div ref={sentinelRef} className='w-1' aria-hidden='true' />}
        </div>
      </section>
    </main>
  );
}
