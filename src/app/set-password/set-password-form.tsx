'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export function SetPasswordForm() {
  const { user } = useUser();
  const me = useQuery(api.users.index.getMe);
  const markChanged = useMutation(api.users.index.markPasswordChanged);
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (me === undefined) return <p className='text-white'>Loading…</p>;
  if (me === null) {
    return (
      <p className='max-w-md text-center text-white'>
        Your account is not linked to a graduate record yet. Contact the yearbook team if you
        believe this is a mistake.
      </p>
    );
  }
  if (!me.must_change_password) redirect('/graduates');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || busy) return;
    if (newPassword !== confirmPassword) return setError('Passwords do not match');
    if (newPassword.length < 15) return setError('Password must be at least 15 characters');

    setBusy(true);
    setError(undefined);
    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions: true,
      });
      await markChanged();
      router.push('/graduates');
    } catch (e) {
      const clerkError = (e as { errors?: { long_message?: string; message?: string }[] })
        ?.errors?.[0];
      setError(
        clerkError?.long_message ??
          clerkError?.message ??
          'Could not update password. Check your temporary password and try again.',
      );
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className='flex w-full max-w-sm flex-col gap-4'>
      <h1 className='text-2xl font-bold text-[#F4E590]'>Set your password</h1>
      <p className='text-sm text-white/70'>
        This is your first sign-in. Enter the temporary password you were given, then choose a new
        one.
      </p>
      <input
        type='password'
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder='Temporary password'
        required
        autoComplete='current-password'
        className='rounded-full border-4 border-[#F4E590] bg-[#343434] px-4 py-3 text-white'
      />
      <input
        type='password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder='New password (15+ characters)'
        required
        minLength={15}
        autoComplete='new-password'
        className='rounded-full border-4 border-[#F4E590] bg-[#343434] px-4 py-3 text-white'
      />
      <input
        type='password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder='Confirm new password'
        required
        minLength={15}
        autoComplete='new-password'
        className='rounded-full border-4 border-[#F4E590] bg-[#343434] px-4 py-3 text-white'
      />
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type='submit'
        disabled={busy}
        className='rounded-full bg-[#F4E590] py-3 font-semibold text-black transition hover:bg-yellow-600 disabled:opacity-50'>
        {busy ? 'Saving…' : 'Set password'}
      </button>
    </form>
  );
}
