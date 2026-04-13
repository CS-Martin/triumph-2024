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
      <div className='h-full flex flex-col lg:flex-row items-center justify-center px-8 lg:px-16'>
        {/* Left side - 3D Model Space */}
        <div className='hidden lg:block lg:w-1/2 relative'>
          {/* 3D model will be placed here */}
          <div className='w-full h-full flex items-center justify-center'>
            {/* Placeholder for 3D model */}
            <div className='w-96 h-96 bg-linear-to-br from-gray-600 to-gray-800 rounded-full opacity-20 blur-2xl'></div>
          </div>
        </div>

        {/* Right side - Valedictorian Message */}
        <div className='w-full lg:w-1/2 pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 xl:pl-16 xl:pr-16 flex items-center justify-center'>
          <div className='relative max-w-4xl mx-auto'>
            <h2
              ref={titleRef}
              className='mb-8'
              style={{
                fontFamily: 'var(--font-beau-rivage)',
                color: '#F4E590',
                fontSize: 'clamp(2rem, 6vw, 12rem)',
                lineHeight: 1,
              }}>
              Class Valedictorian
            </h2>
            {/* Opening quotation mark */}
            <span
              className='text-white absolute'
              style={{
                fontFamily: 'var(--font-montagu-slab)',
                fontSize: 'clamp(4rem, 12vw, 18rem)',
                top: 'clamp(2rem, 3.5vw, 23rem)',
                right: 'clamp(-9rem, -4vw, -8rem)',
                lineHeight: 1,
              }}>
              "
            </span>

            <div ref={contentRef} className='text-justify'>
              <p
                className='text-white leading-relaxed text-lg lg:text-xl mb-6'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Good day to our University President, administrators, faculty, parents, and my fellow graduates of
                Ateneo de Naga University.
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-4'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Today, we stand not just as students who completed a program, but as individuals shaped by years of
                perseverance, sacrifice, and faith. Behind our togas are sleepless nights, quiet doubts, financial
                struggles, creative blocks, and moments when giving up felt easier than pushing forward. Yet here we
                are, stronger, wiser, and deeply grateful.
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-4'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Our theme, “Every Thread of Struggle, A Tapestry of Triumph,” reminds us that success was never woven
                overnight. Each setback strengthened our character. Each failure refined our purpose. Each act of
                kindness and collaboration reflected the Ignatian spirit of cura personalis and being men and women for
                and with others. This diploma is not just proof of what we have learned, but of who we have become.
              </p>

              <p
                className='text-white/90 leading-relaxed text-base lg:text-lg mb-6'
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                As we leave these halls, may we continue to seek the magis, not just to achieve more, but to serve more,
                love more, and lead with integrity. The world awaits the tapestry we will continue to weave.
                Congratulations, Batch 2024. Ad Majorem Dei Gloriam.
              </p>

              {/* Valedictorian Signature */}
              <div className='absolute bottom-8 left-0 right-0 flex justify-center text-[#c8a44a]'>
                <img src='/pres-signature.png' alt='Valedictorian Signature' className='h-16 lg:h-20 opacity-90' />
              </div>
            </div>

            {/* Closing quotation mark */}
            <span
              className='text-white absolute'
              style={{
                fontFamily: 'var(--font-montagu-slab)',
                fontSize: 'clamp(4rem, 12vw, 18rem)',
                rotate: '180deg',
                bottom: '-3rem',
                left: '-8rem',
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
