'use client';

export default function PhotoListLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col w-full h-full">
      <main className="flex flex-col items-start gap-4 w-full h-full m-auto md:max-w-[1080px] md:gap-6">
        {children}
      </main>
    </div>
  );
}
