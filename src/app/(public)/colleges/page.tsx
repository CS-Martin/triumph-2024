'use client';

import { Navbar } from '@/components/layout/nav';
import { Carousel3D, type CarouselItem } from '@/components/carousel-3d';

const colleges: CarouselItem[] = [
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
  return (
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <Carousel3D items={colleges} variant='wide' getHref={(key) => `/colleges/${key}`} />
    </main>
  );
}
