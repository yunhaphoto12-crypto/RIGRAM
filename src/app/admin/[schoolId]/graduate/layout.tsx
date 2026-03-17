import TopTab from '@/components/tab/top';

export default function GraduateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <header className="flex justify-end items-center">
        <TopTab />
      </header>
      <main className="relative flex flex-col items-start gap-4 w-full h-full m-auto overflow-hidden md:max-w-[1080px]">
        {children}
      </main>
    </div>
  );
}
