'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/nav';
import { useParams } from 'next/navigation';

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
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-1.png',
      },
      {
        id: '2',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '3',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '4',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '5',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '6',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '7',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
      },
      {
        id: '8',
        name: 'FABAY, ALFREDO C.',
        title: 'Vice President for Higher Education',
        image: '/graduates/graduate-2.png',
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

export default function CollegeGraduatesPage() {
  const params = useParams();
  const collegeKey = params['college-key'] as string;
  const collegeData = collegesGraduatesData[collegeKey];

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
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <section className='relative pt-36 sm:pt-44 md:pt-40 pb-20 px-4 md:px-8'>
        <div className='mx-auto max-w-[1440px]'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center'>
            {collegeData.graduates.map((graduate) => (
              <Link
                key={graduate.id}
                href={`/colleges/${collegeKey}/${graduate.id}`}
                className='relative flex flex-col items-center group cursor-pointer'>
                <div className='relative w-[280px] h-[360px] sm:w-[300px] sm:h-[400px]'>
                  <Image src='/graduates-frame.png' alt='Frame' fill className='pointer-events-none' priority />
                  <div className='absolute overflow-hidden'>
                    <Image
                      src={graduate.image}
                      alt={graduate.name}
                      fill
                      className='object-contain group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 640px) 280px, (max-width: 1024px) 300px, 300px'
                    />
                  </div>
                </div>
                <div className='mt-4 text-center'>
                  <h3
                    className='text-[#F4E590] text-lg font-semibold group-hover:text-white transition-colors'
                    style={{ fontFamily: 'var(--font-rosarivo)' }}>
                    {graduate.name}
                  </h3>
                  <p className='text-white/80 text-sm mt-1'>{graduate.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
