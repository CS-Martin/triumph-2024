'use client';

import { useQuery } from 'convex/react';
import { redirect } from 'next/navigation';
import { api } from '@convex/_generated/api';

export function MustChangeGate({ children }: { children: React.ReactNode }) {
  const me = useQuery(api.users.index.getMe);

  if (me === undefined) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#1a1a1a] px-6'>
        <p className='text-white'>Loading…</p>
      </main>
    );
  }

  if (me === null) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#1a1a1a] px-6'>
        <p className='max-w-md text-center text-white'>
          Your account is not linked to a graduate record yet. Contact the yearbook team if you
          believe this is a mistake.
        </p>
      </main>
    );
  }

  if (me.must_change_password) redirect('/set-password');

  return <>{children}</>;
}
