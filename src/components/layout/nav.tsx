'use client';

import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 right-0 w-full py-9 px-2 xl:px-0 z-50'>
      <div className='xl:px-25 mx-auto flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <img src='/triumph-icon.png' alt='Triumph Icon' className='h-10 w-auto' />
          <img src='/triumph-logo.png' alt='Triumph 2024' className='h-12 w-auto' />
        </div>

        {/* Navigation Links - Desktop */}
        <div className='hidden lg:flex items-center gap-8' style={{ fontFamily: 'var(--font-rosarivo)' }}>
          <a href='#messages' className='text-[#F4E590] hover:text-white transition-colors text-lg font-medium'>
            Messages
          </a>
          <Link href='/colleges' className='text-[#F4E590] hover:text-white transition-colors text-lg font-medium'>
            Colleges
          </Link>
          <Link href='/university' className='text-[#F4E590] hover:text-white transition-colors text-lg font-medium'>
            Administrator, Faculty, and Staff
          </Link>
          <a href='#events' className='text-[#F4E590] hover:text-white transition-colors text-lg font-medium'>
            University Events
          </a>
        </div>

        {/* Search Bar */}
        <div className='hidden md:flex items-center'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search'
              className='bg-transparent border-2 border-[#F4E590] rounded-full py-1.5 px-4 pl-10 text-[#F4E590] placeholder-[#F4E590]/70 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#F4E590]/50'
              style={{ fontFamily: 'var(--font-rosarivo)' }}
            />
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F4E590]' />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='lg:hidden text-[#F4E590] p-2'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label='Toggle menu'>
          {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='lg:hidden mt-4 pb-4 border-t border-[#F4E590]/20'>
          <div className='flex flex-col gap-4 pt-4'>
            <a
              href='#messages'
              className='text-[#F4E590] hover:text-white transition-colors text-sm font-medium'
              style={{ fontFamily: 'var(--font-rosarivo)' }}>
              Messages
            </a>
            <Link
              href='/colleges'
              className='text-[#F4E590] hover:text-white transition-colors text-sm font-medium'
              style={{ fontFamily: 'var(--font-rosarivo)' }}>
              Colleges
            </Link>
            <a
              href='#graduates'
              className='text-[#F4E590] hover:text-white transition-colors text-sm font-medium'
              style={{ fontFamily: 'var(--font-rosarivo)' }}>
              Graduates
            </a>
            <Link
              href='/university'
              className='text-[#F4E590] hover:text-white transition-colors text-sm font-medium'
              style={{ fontFamily: 'var(--font-rosarivo)' }}>
              University
            </Link>
            <a
              href='#events'
              className='text-[#F4E590] hover:text-white transition-colors text-sm font-medium'
              style={{ fontFamily: 'var(--font-rosarivo)' }}>
              University Events
            </a>
            {/* Mobile Search */}
            <div className='relative mt-2'>
              <input
                type='text'
                placeholder='Search'
                className='bg-transparent border-2 border-[#F4E590] rounded-full py-1.5 px-4 pl-10 text-[#F4E590] placeholder-[#F4E590]/70 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#F4E590]/50'
                style={{ fontFamily: 'var(--font-rosarivo)' }}
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F4E590]' />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
