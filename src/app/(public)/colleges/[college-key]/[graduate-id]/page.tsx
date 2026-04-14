'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/nav';
import { useParams } from 'next/navigation';

type GraduateItem = {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  achievements: string[];
};

const graduatesData: Record<string, GraduateItem> = {
  '1': {
    id: '1',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-1.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '2': {
    id: '2',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-2.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '3': {
    id: '3',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-3.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '4': {
    id: '4',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-4.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '5': {
    id: '5',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-5.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '6': {
    id: '6',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-6.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '7': {
    id: '7',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-7.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
  '8': {
    id: '8',
    name: 'FABAY, ALFREDO C.',
    title: 'Vice President for Higher Education',
    image: '/graduates/graduate-8.png',
    description:
      'A distinguished academic leader with decades of experience in higher education administration, dedicated to advancing educational excellence and student success.',
    achievements: [
      'PhD in Educational Leadership',
      '25+ years in academic administration',
      'Published researcher in education policy',
      'Award for Excellence in Teaching',
    ],
  },
};

export default function GraduateDetailPage() {
  const params = useParams();
  const graduateId = params['graduate-id'] as string;
  const graduate = graduatesData[graduateId];

  if (!graduate) {
    return (
      <main className='min-h-screen bg-[#0a0a0a] text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-screen'>
          <p>Graduate not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <section className='relative pt-36 sm:pt-44 md:pt-60 pb-20 px-4 md:px-8'>
        <div className='mx-auto max-w-[1400px]'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='flex justify-center'>
              <div className='relative w-[350px] h-[450px] sm:w-[400px] sm:h-[500px]'>
                <Image
                  src='/graduates-frame.png'
                  alt='Frame'
                  fill
                  className='object-cover pointer-events-none'
                  priority
                />
                <div className='absolute inset-[12px] overflow-hidden'>
                  <Image src={graduate.image} alt={graduate.name} fill className='object-cover' priority />
                </div>
              </div>
            </div>

            <div className='text-center lg:text-left'>
              <h1
                className='text-[#F4E590] leading-[0.9] mb-4'
                style={{ fontFamily: 'var(--font-beau-rivage)', fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
                {graduate.name}
              </h1>
              <h2 className='text-white/90 text-xl mb-6'>{graduate.title}</h2>
              <p className='text-white/85 text-lg leading-relaxed mb-8'>{graduate.description}</p>

              <div className='mb-8'>
                <h3 className='text-[#F4E590] text-xl mb-4' style={{ fontFamily: 'var(--font-beau-rivage)' }}>
                  Achievements
                </h3>
                <ul className='space-y-2 text-white/80'>
                  {graduate.achievements.map((achievement, index) => (
                    <li key={index}>· {achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
