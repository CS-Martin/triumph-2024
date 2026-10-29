'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export default function GraduatesPage() {
  const me = useQuery(api.users.index.getMe);

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#1a1a1a] px-6'>
      <p className='text-center text-white'>
        {me === undefined || me === null
          ? 'Loading…'
          : `Welcome, ${me.first_name} ${me.last_name}. The yearbook is coming soon.`}
      </p>
    </main>
  );
}
