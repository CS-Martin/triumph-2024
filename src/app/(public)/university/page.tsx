'use client';

import { Navbar } from '@/components/layout/nav';
import { Carousel3D, type CarouselItem } from '@/components/carousel-3d';

const universityItems: CarouselItem[] = [
  {
    key: 'faculty',
    name: 'Administrator, Faculty, and Staff',
    image: '/university/admin-faculty-staff.png',
    description:
      'Dedicated educators and researchers committed to academic excellence, mentorship, and the pursuit of knowledge.',
    programs: ['Professorial Faculty', 'Associate Professors', 'Assistant Professors', 'Lecturers & Instructors'],
  },
  {
    key: 'administrators',
    name: 'University Administrators',
    image: '/university/deans.png',
    description:
      'Leading with vision and integrity, our administrators guide the institution toward academic excellence and innovation.',
    programs: ['President & Vice Presidents', 'Deans & Directors', 'Department Chairs', 'Administrative Services'],
  },
  {
    key: 'staff',
    name: 'Support Staff',
    image: '/university/pillars-staff.png',
    description:
      'Essential team members who ensure the smooth operation of university services and maintain our academic environment.',
    programs: ['Administrative Staff', 'Technical Support', 'Maintenance & Operations', 'Student Services'],
  },
];

export default function UniversityPage() {
  return (
    <main className='min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden'>
      <Navbar />

      <Carousel3D items={universityItems} variant='compact' />
    </main>
  );
}
