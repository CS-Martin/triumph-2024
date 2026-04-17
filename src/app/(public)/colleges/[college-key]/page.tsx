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
        name: 'ABAWAG, JAMES MARCEL A.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Abawag%2C%20James%20Marcel%20A..webp',
      },
      {
        id: '2',
        name: 'AGRAVANTE, MARL VINCENT C.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Agravante%2C%20Marl%20Vincent%20C..webp',
      },
      {
        id: '3',
        name: 'ALFONSO, ARIEL DOMINIC A.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Alfonso%2C%20Ariel%20Dominic%20A..webp',
      },
      {
        id: '4',
        name: 'BARTOLOME, EL JON JOSHUA G.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Bartolome%2C%20El%20Jon%20Joshua%20G..webp',
      },
      {
        id: '5',
        name: 'BETITO, JOSEPH RAPHAEL L.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Betito%2C%20Joseph%20Raphael%20L..webp',
      },
      {
        id: '6',
        name: 'CATORCE, HENRY JR. D.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Catorce%2C%20Henry%20Jr.%20D..webp',
      },
      {
        id: '7',
        name: 'CHUA, WILLIAN B.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Chua%2C%20Willian%20B..webp',
      },
      {
        id: '8',
        name: 'FERNANDEZ, JERU KIAN C.',
        title: 'Bachelor of Science in Computer Science',
        image: '/api/r2/files/triumph-2024/toga/TOGA_Fernandez%2C%20Jeru%20Kian%20C..webp',
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
                  <div className='absolute inset-10 overflow-hidden z-0'>
                    <img
                      src={graduate.image}
                      alt={graduate.name}
                      className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <Image src='/graduates-frame.png' alt='Frame' fill className='pointer-events-none z-10' priority />
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
