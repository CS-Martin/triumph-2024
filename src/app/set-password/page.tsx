import { auth } from '@clerk/nextjs/server';
import { SetPasswordForm } from './set-password-form';

export default async function SetPasswordPage() {
  await auth.protect();

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#1a1a1a] px-6'>
      <SetPasswordForm />
    </main>
  );
}
