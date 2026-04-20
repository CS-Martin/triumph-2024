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

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const graduatesData: Record<string, GraduateItem> = {
  '1': {
    id: '1',
    name: 'ABAWAG, JAMES MARCEL A.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Abawag, James Marcel A..webp',
    description:
      'A dedicated Computer Science graduate with strong analytical skills and a passion for software development.',
    achievements: ['Bachelor of Science in Computer Science', 'Specialized in Software Engineering', "Dean's Lister"],
  },
  '2': {
    id: '2',
    name: 'AGRAVANTE, MARL VINCENT C.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Agravante, Marl Vincent C..webp',
    description: 'An innovative Computer Science graduate with expertise in web development and database management.',
    achievements: [
      'Bachelor of Science in Computer Science',
      'Web Development Specialist',
      'Academic Excellence Award',
    ],
  },
  '3': {
    id: '3',
    name: 'ALFONSO, ARIEL DOMINIC A.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Alfonso, Ariel Dominic A..webp',
    description: 'A motivated Computer Science graduate with strong problem-solving abilities and technical expertise.',
    achievements: ['Bachelor of Science in Computer Science', 'Programming Competition Finalist', 'Research Assistant'],
  },
  '4': {
    id: '4',
    name: 'BARTOLOME, EL JON JOSHUA G.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Bartolome, El Jon Joshua G..webp',
    description: 'A skilled Computer Science graduate with proficiency in mobile app development and cloud computing.',
    achievements: ['Bachelor of Science in Computer Science', 'Mobile App Developer', 'Cloud Computing Certificate'],
  },
  '5': {
    id: '5',
    name: 'BETITO, JOSEPH RAPHAEL L.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Betito, Joseph Raphael L..webp',
    description: 'A driven Computer Science graduate with expertise in data science and machine learning.',
    achievements: [
      'Bachelor of Science in Computer Science',
      'Data Science Specialist',
      'Machine Learning Project Lead',
    ],
  },
  '6': {
    id: '6',
    name: 'CATORCE, HENRY JR. D.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Catorce, Henry Jr. D..webp',
    description: 'A talented Computer Science graduate with strong skills in cybersecurity and network administration.',
    achievements: [
      'Bachelor of Science in Computer Science',
      'Cybersecurity Specialist',
      'Network Administrator Certification',
    ],
  },
  '7': {
    id: '7',
    name: 'CHUA, WILLIAN B.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Chua, Willian B..webp',
    description: 'An accomplished Computer Science graduate with expertise in artificial intelligence and robotics.',
    achievements: ['Bachelor of Science in Computer Science', 'AI Researcher', 'Robotics Competition Winner'],
  },
  '8': {
    id: '8',
    name: 'FERNANDEZ, JERU KIAN C.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Fernandez, Jeru Kian C..webp',
    description: 'A creative Computer Science graduate with skills in game development and interactive media.',
    achievements: ['Bachelor of Science in Computer Science', 'Game Developer', 'Interactive Media Designer'],
  },
  '9': {
    id: '9',
    name: 'GUERRERO, MARK JOSEPH R.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Guerrero, Mark Joseph R..webp',
    description: 'A dedicated Computer Science graduate with expertise in full-stack development.',
    achievements: [
      'Bachelor of Science in Computer Science',
      'Full-Stack Developer',
      'Software Architecture Specialist',
    ],
  },
  '10': {
    id: '10',
    name: 'LAGTO, SEAN REVON F.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Lagto, Sean Revon F..webp',
    description: 'An innovative Computer Science graduate with skills in blockchain and distributed systems.',
    achievements: ['Bachelor of Science in Computer Science', 'Blockchain Developer', 'Distributed Systems Expert'],
  },
  '11': {
    id: '11',
    name: 'MANGUNAY, XIER GABRIEL M.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Mangunay, Xier Gabriel M..webp',
    description: 'A skilled Computer Science graduate with expertise in UI/UX design and front-end development.',
    achievements: ['Bachelor of Science in Computer Science', 'UI/UX Designer', 'Front-End Development Specialist'],
  },
  '12': {
    id: '12',
    name: 'MARIANO, MARC THOMAS F.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Mariano, Marc Thomas F..webp',
    description: 'A motivated Computer Science graduate with expertise in DevOps and cloud infrastructure.',
    achievements: ['Bachelor of Science in Computer Science', 'DevOps Engineer', 'Cloud Infrastructure Specialist'],
  },
  '13': {
    id: '13',
    name: 'NABUS, KENRICK JOHN HARVELL B.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Nabus, Kenrick John Harvell B..webp',
    description: 'A talented Computer Science graduate with skills in database design and data analytics.',
    achievements: ['Bachelor of Science in Computer Science', 'Database Administrator', 'Data Analytics Specialist'],
  },
  '14': {
    id: '14',
    name: 'PALMA, KYLE JAMES G.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Palma, Kyle James G..webp',
    description: 'A driven Computer Science graduate with expertise in embedded systems and IoT.',
    achievements: ['Bachelor of Science in Computer Science', 'Embedded Systems Engineer', 'IoT Developer'],
  },
  '15': {
    id: '15',
    name: 'PEREZ, MA. LOUISA A.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Perez, Ma. Louisa A..webp',
    description: 'An accomplished Computer Science graduate with expertise in software testing and quality assurance.',
    achievements: ['Bachelor of Science in Computer Science', 'QA Engineer', 'Software Testing Specialist'],
  },
  '16': {
    id: '16',
    name: 'REMOS, MARY ANGELETTE M.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Remos, Mary Angelette M..webp',
    description: 'A creative Computer Science graduate with skills in digital media and content management.',
    achievements: ['Bachelor of Science in Computer Science', 'Digital Media Specialist', 'Content Management Expert'],
  },
  '17': {
    id: '17',
    name: 'TORDILLA, ALECZIA S.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Tordilla, Aleczia S..webp',
    description: 'A dedicated Computer Science graduate with expertise in systems analysis and business intelligence.',
    achievements: ['Bachelor of Science in Computer Science', 'Systems Analyst', 'Business Intelligence Specialist'],
  },
  '18': {
    id: '18',
    name: 'VIDOLA, JAMES EDWARD Q.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Vidola, James Edward Q..webp',
    description: 'An innovative Computer Science graduate with skills in computer graphics and visualization.',
    achievements: ['Bachelor of Science in Computer Science', 'Graphics Programmer', 'Visualization Specialist'],
  },
  '19': {
    id: '19',
    name: 'VILLASANTA, RAMONCITO D.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Villasanta, Ramoncito D.webp',
    description: 'A skilled Computer Science graduate with expertise in network security and penetration testing.',
    achievements: ['Bachelor of Science in Computer Science', 'Security Analyst', 'Penetration Testing Specialist'],
  },
  '20': {
    id: '20',
    name: 'VIOLA, PAUL ENRICO N.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Viola, Paul Enrico N..webp',
    description: 'A motivated Computer Science graduate with expertise in mobile development and cross-platform apps.',
    achievements: [
      'Bachelor of Science in Computer Science',
      'Mobile App Developer',
      'Cross-Platform Development Specialist',
    ],
  },
  '21': {
    id: '21',
    name: 'WOOD, MATTHEW ETHAN G.',
    title: 'Bachelor of Science in Computer Science',
    image: '/api/r2/files/triumph-2024/toga/TOGA_Wood, Matthew Ethan G..webp',
    description: 'A talented Computer Science graduate with expertise in software engineering and system architecture.',
    achievements: ['Bachelor of Science in Computer Science', 'Software Engineer', 'System Architecture Specialist'],
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

      <section className='relative pt-32 sm:pt-40 md:pt-44 pb-14 px-4 md:px-8'>
        <div className='mx-auto max-w-[1400px]'>
          <div className='grid grid-cols-1 lg:grid-cols-[700px_minmax(0,1fr)] gap-10 md:gap-14 items-center'>
            <div className='flex justify-center lg:justify-start'>
              <div className='relative w-[320px] h-[427px] sm:w-[400px] sm:h-[533px] md:w-[650px] md:h-[867px]'>
                <div className='absolute inset-[12%] overflow-hidden z-0'>
                  <Image src={graduate.image} alt={graduate.name} fill className='object-cover' priority />
                </div>
                <Image
                  src='/graduates-frame.png'
                  alt='Frame'
                  fill
                  className='object-contain pointer-events-none z-10'
                  priority
                />
              </div>
            </div>

            <div className='text-center lg:text-left max-w-[640px]'>
              <h1
                className='text-[#F4E590] leading-[0.88] mb-4'
                style={{ fontFamily: 'var(--font-beau-rivage)', fontSize: 'clamp(2.6rem,5.8vw,6rem)' }}>
                {toTitleCase(graduate.name)}
              </h1>

              <h2 className='text-white/90 text-base sm:text-lg md:text-xl font-semibold mb-5'>{graduate.title}</h2>

              <p className='text-white/80 text-sm sm:text-base leading-relaxed mb-5'>{graduate.description}</p>

              <p className='text-white/75 text-sm sm:text-base leading-relaxed mb-6'>
                {graduate.achievements.slice(0, 2).join(' • ')}
              </p>

              <p className='text-[#F4E590] text-xl sm:text-2xl' style={{ fontFamily: 'var(--font-beau-rivage)' }}>
                {graduate.achievements[graduate.achievements.length - 1]}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
