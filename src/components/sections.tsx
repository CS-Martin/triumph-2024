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

export function PresidentMessageSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: '30% top',
        scrub: 1,
      },
    });

    if (titleRef.current) {
      // Split title into individual characters
      const text = titleRef.current.innerText || '';
      const chars = text.split('');

      // Clear the original text
      titleRef.current.innerHTML = '';

      // Wrap each character in a span
      chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100px)';
        titleRef.current?.appendChild(span);

        // Character stagger animation: fade-up from below
        tl.to(
          span,
          {
            y: -30,
            opacity: 1,
            duration: 3,
            ease: 'power3.inOut',
          },
          index * 0.06,
        );
      });
    }

    // Text content fade animations
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');

      // Set initial opacity to 0
      gsap.set(paragraphs, { opacity: 0 });

      paragraphs.forEach((p, index) => {
        // Fade in animation
        tl.to(
          p,
          {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          },
          18 * 0.06 + index * 0.2,
        );

        // Fade out animation
        tl.to(
          p,
          {
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
          },
          18 * 0.06 + index * 0.2 + 2,
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className='h-screen relative overflow-hidden'>
      <div className='h-full flex items-center justify-between px-8 lg:px-16'>
        {/* Left side - President's Message */}
        <div className='pl-6 pr-4 sm:pl-8 sm:pr-6 md:pl-12 md:pr-8 lg:pl-80 lg:pr-12 xl:pl-96 xl:pr-16 max-w-7xl text-center'>
          <h2
            ref={titleRef}
            className='mb-8'
            style={{
              fontFamily: 'var(--font-beau-rivage)',
              color: '#F4E590',
              fontSize: 'clamp(2rem, 6vw, 8rem)',
              lineHeight: 1,
            }}>
            President's Message
          </h2>

          <div className='relative'>
            {/* Opening quotation mark */}
            <span
              className='text-white absolute'
              style={{
                fontFamily: 'var(--font-montagu-slab)',
                fontSize: '18rem',
                rotate: '-180deg',
                top: '-13rem',
                left: '-8rem',
                lineHeight: 1,
              }}>
              "
            </span>

            <div ref={contentRef} className=' text-justify'>
              <p
                className='text-white leading-relaxed text-lg lg:text-xl mb-6'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                To the Graduates of Batch 2024 of Ateneo de Naga University,
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-4'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Today, we celebrate not only your academic achievement but the remarkable journey that brought you here.
                Behind every medal, every completed requirement, and every proud smile lies a story of perseverance,
                sacrifice, and quiet courage. You have faced uncertainties and challenges with resilience, allowing each
                experience to shape you into men and women of competence, conscience, and compassion.
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-4'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Rooted in our Ignatian tradition, you embraced cura personalis, cared for one another, and continually
                sought the magis, the greater good beyond personal success. As you step beyond the University, carry
                with you the commitment to be men and women for and with others, transforming your knowledge into
                service and your talents into instruments of hope.
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-6'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                May you continue weaving threads of integrity, faith, and excellence wherever life leads you.
                Congratulations, Batch 2024. Your tapestry of triumph has only just begun.
              </p>

              {/* President Signature */}
              <div className='absolute bottom-8 left-0 right-0 flex justify-center text-[#c8a44a]'>
                <img src='/pres-signature.png' alt='President Signature' className='h-16 lg:h-20 opacity-90' />
              </div>
            </div>

            {/* Closing quotation mark */}
            <span
              className='text-white absolute'
              style={{
                fontFamily: 'var(--font-montagu-slab)',
                fontSize: '18rem',
                bottom: '-7rem',
                right: '-8rem',
                lineHeight: 1,
              }}>
              "
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ValedictorianMessageSection() {
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
        </div>
      </div>
    </section>
  );
}
