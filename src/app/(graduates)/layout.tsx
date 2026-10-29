import { auth } from '@clerk/nextjs/server';
import { MustChangeGate } from './must-change-gate';
import { SignOutButton } from '@clerk/nextjs';

export default async function GraduatesLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();

  return (
    <MustChangeGate>
      <div className='absolute right-4 top-4 z-50'>
        <SignOutButton redirectUrl='/'>
          <button className='rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/10'>
            Sign out
          </button>
        </SignOutButton>
      </div>
      {children}
    </MustChangeGate>
  );
}
