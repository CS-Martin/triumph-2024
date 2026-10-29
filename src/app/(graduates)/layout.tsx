import { auth } from '@clerk/nextjs/server';
import { MustChangeGate } from './must-change-gate';

export default async function GraduatesLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();

  return <MustChangeGate>{children}</MustChangeGate>;
}
