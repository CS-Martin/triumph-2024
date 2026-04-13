'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function WelcomeSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '20% top',
        scrub: 1,
      },
    });

    // Float up and fade animation
    tl.to(titleRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className='h-screen relative overflow-hidden'>
      {/* Title positioned at bottom, behind where 3D model will be */}
      <div ref={titleRef} className='absolute inset-0 flex items-end justify-center px-8 pb-16 pointer-events-none'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1
            className='text-5xl md:text-6xl lg:text-[8rem] leading-tight'
            style={{
              fontFamily: 'var(--font-beau-rivage)',
              color: '#F4E590',
            }}>
            Every Thread Of Struggle,
            <br />A Tapestry Of Triumph.
          </h1>
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='max-w-4xl mx-auto px-8 text-center'>
        <h1 className='text-6xl font-bold text-white mb-6' style={{ fontFamily: 'Georgia, serif' }}>
          Welcome to Triumph 2024
        </h1>
        <p className='text-xl text-gray-300 leading-relaxed'>
          Experience an extraordinary journey through innovation, creativity, and achievement.
        </p>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='max-w-4xl mx-auto px-8'>
        <h2 className='text-5xl font-bold text-white mb-8' style={{ fontFamily: 'Georgia, serif' }}>
          About the Event
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
            <h3 className='text-2xl font-semibold text-[#c8a44a] mb-4'>Innovation</h3>
            <p className='text-gray-200'>Discover cutting-edge technologies and groundbreaking ideas.</p>
          </div>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
            <h3 className='text-2xl font-semibold text-[#c8a44a] mb-4'>Excellence</h3>
            <p className='text-gray-200'>Celebrate outstanding achievements and recognize those who push limits.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
