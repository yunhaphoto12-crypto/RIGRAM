'use client';

import BottomTab from '@/components/tab/bottom';
import TopTab from '@/components/tab/top';
import { usePathname } from 'next/navigation';

export default function IntroductionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const parts = pathname.split('/');
  const section = parts[3];
  const validPaths = ['foreground', 'history', 'symbol', 'executive'];
  const hasPathname = validPaths.includes(section);

  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex justify-center md:justify-end items-center">
        <TopTab />
      </header>
      <main className="relative flex flex-col items-start gap-4 w-full h-full m-auto overflow-hidden md:max-w-[1080px]">
        {children}
        {hasPathname && <BottomTab purpose="school_intro" />}
      </main>
    </div>
  );
}
