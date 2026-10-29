'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/nav';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { COLLEGE_ID_BY_KEY } from '@convex/lib/colleges';

const toTitleCase = (str: string) =>
  str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function GraduateDetailPage() {
  const params = useParams();
  const collegeKey = params['college-key'] as string;
  const slug = params['slug'] as string;
  const college = COLLEGE_ID_BY_KEY[collegeKey];
  const graduate = useQuery(
    api.users.index.getBySlug,
    college === undefined ? 'skip' : { college, slug },
  );

  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const text = textRef.current;
    if (!section || !frame || !text || graduate === undefined) return;

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo(frame, { autoAlpha: 0, y: 60, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 })
      .fromTo(text, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.45');

    const handleMove = (event: MouseEvent) => {
      const rect = frame.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(frame, {
        rotationY: relX * 3,
        rotationX: relY * -2,
        x: relX * 8,
        y: relY * 5,
        transformPerspective: 1200,
        transformOrigin: 'center',
        duration: 0.35,
        ease: 'power2.out',
      });
    };
    const handleLeave = () => {
      gsap.to(frame, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power3.out' });
    };
    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
      intro.kill();
      gsap.killTweensOf(frame);
    };
  }, [collegeKey, slug, graduate]);

  if (college === undefined || graduate === null) {
    return (
      <main className='min-h-screen bg-[#0a0a0a] text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-screen'>
          <p>Graduate not found</p>
        </div>
      </main>
    );
  }

  if (graduate === undefined) {
    return (
      <main className='min-h-screen bg-[#0a0a0a] text-white'>
        <Navbar />
      </main>
    );
  }

  const name = `${toTitleCase(graduate.first_name)} ${toTitleCase(graduate.last_name)}${graduate.suffix ? `, ${graduate.suffix}` : ''}`;
  const image = graduate.toga_key ?? graduate.creative_key;
  const meta = [graduate.program, graduate.major].filter(Boolean).join(', ');

  return (
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <section ref={sectionRef} className='relative pt-32 sm:pt-40 md:pt-40 pb-14 px-4 md:px-8 min-h-screen'>
        <div className='absolute inset-0 w-full h-full pointer-events-none z-0'>
          <Image src='/events/university-events-bg.webp' alt='University Events Background' fill className='object-cover' priority />
        </div>

        <motion.div className='relative z-10 mx-auto' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
          <div className='grid grid-cols-1 lg:grid-cols-[1200px_minmax(0,1fr)] gap-10 md:gap-14 items-center'>
            <div className='flex justify-end'>
              <div ref={frameRef} className='relative w-[320px] h-[427px] sm:w-[400px] sm:h-[533px] md:w-[800px] md:h-[1000px] will-change-transform'>
                <div className='absolute inset-[13%] overflow-hidden z-0'>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/r2/files/${image}`} alt={name} className='h-full w-full object-contain' />
                  ) : (
                    <div className='w-full h-full bg-white/10 flex items-center justify-center text-white/50 text-sm'>
                      No Image
                    </div>
                  )}
                </div>
                <Image src='/graduates-frame.png' alt='Frame' fill className='object-contain pointer-events-none z-10' priority />
              </div>
            </div>

            <motion.div ref={textRef} className='text-center lg:text-left max-w-[640px]' initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <motion.h1 className='text-[#F4E590] leading-[0.88] mb-4' style={{ fontFamily: 'var(--font-beau-rivage)', fontSize: 'clamp(3rem,6vw,7rem)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                {name}
              </motion.h1>

              <motion.h2 className='text-white/90 text-base sm:text-lg md:text-xl font-semibold mb-5' initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.38 }}>
                {meta}
              </motion.h2>

              {graduate.write_up && (
                <motion.p className='text-white/80 text-sm sm:text-base leading-relaxed mb-5' initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.45 }}>
                  {graduate.write_up}
                </motion.p>
              )}

              {graduate.achievements.length > 0 && (
                <>
                  <motion.p className='text-white/75 text-sm sm:text-base leading-relaxed mb-6' initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.52 }}>
                    {graduate.achievements.slice(0, 2).join(' • ')}
                  </motion.p>
                  <motion.p className='text-[#F4E590] text-xl sm:text-2xl' style={{ fontFamily: 'var(--font-beau-rivage)' }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.6 }}>
                    {graduate.achievements[graduate.achievements.length - 1]}
                  </motion.p>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
