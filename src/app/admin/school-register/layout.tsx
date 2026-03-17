import Header from '@/components/header';

export default function SchoolRegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 w-screen h-screen overflow-hidden">
      <Header />
      <main className="relative flex flex-col items-start p-5 gap-4 w-full h-full m-auto overflow-hidden md:gap-4 md:p-0 md:max-w-[1080px]">
        {children}
      </main>
    </div>
  );
}
