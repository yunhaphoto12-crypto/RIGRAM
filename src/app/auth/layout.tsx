'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentStep = segments[1];

  return (
    <section className="w-full h-full flex flex-col justify-center items-center px-5">
      <div className="w-full md:max-w-[520px]">
        <figure className="flex flex-col items-center gap-4 md:gap-7">
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <Image
              src={`/images/logo.png`}
              alt="리그램 로고"
              fill
              sizes="(max-width: 768px) 64px, 80px"
              className="object-contain"
            />
          </div>
          <figcaption className="flex flex-col items-center gap-1">
            <h3 className="text-28 md:text-32 font-bold text-gray-900 uppercase">
              photobit - rigram
            </h3>
            <p className="text-16 md:text-20 text-gray-700">추억을 빛내는 디지털 앨범 리그램</p>
          </figcaption>
        </figure>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-400"></div>
          <span className="text-14 md:text-16 px-4 text-gray-400">
            {currentStep === 'login' ? '로그인' : '회원가입'}
          </span>
          <div className="flex-grow h-px bg-gray-400"></div>
        </div>
        {children}
      </div>
    </section>
  );
}
