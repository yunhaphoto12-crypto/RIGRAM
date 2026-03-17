'use client';

import Button from '@/components/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function SchoolRegisterPage() {
  const pathname = usePathname();

  return (
    <section className="w-full h-full flex flex-col justify-center items-center gap-8 md:gap-12">
      <h1 className="sr-only">학교 등록이 안되어 있을 경우</h1>

      <figure className="flex flex-col items-center gap-6 md:gap-7.5">
        <div className="relative w-24 h-24 md:w-54 md:h-54">
          <Image
            src="/images/mainImg.png"
            alt=""
            role="presentation"
            fill
            sizes="(max-width: 768px) 96px, 216px"
            className="object-contain"
          />
        </div>
        <figcaption className="flex flex-col items-center gap-2.5">
          <h2 className="text-20 font-bold text-gray-900 md:text-24">등록된 학교가 없습니다.</h2>
          <p className="text-16 font-medium text-gray-500 text-center md:text-18">
            앨범 생성을 위해 아래 버튼을 클릭하고
            <br />
            학교를 생성하여 시작해 보세요
          </p>
        </figcaption>
      </figure>
      <Button
        className={`text-16 font-semibold bg-primary-300 text-primary-700 rounded-md px-4 py-3 md:text-18 md:px-6 md:py-4 hover:outline hover:outline-primary-700 focus:outline focus:outline-primary-700 active:outline active:outline-primary-700`}
        href={`${pathname}/add`}
      >
        학교 추가하기
      </Button>
    </section>
  );
}
