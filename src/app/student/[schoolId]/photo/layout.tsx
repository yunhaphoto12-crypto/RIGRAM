import TopTab from '@/components/tab/top';

export default function PhotoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-end items-center">
        <TopTab />
      </div>
      <main className="flex flex-1 w-full h-full mx-auto max-w-[1080px]">{children}</main>
    </div>
  );
}
