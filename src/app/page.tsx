'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const schoolId = localStorage.getItem('schoolId');
      const userType = localStorage.getItem('userType');

      if (schoolId) {
        router.replace(`/${userType}/${schoolId}`);
      } else {
        router.replace('/auth/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="w-full h-full bg-blue flex justify-center items-center flex-col gap-10 md:gap-16">
      <Image
        src="/images/splash_img.png"
        alt="졸업은 새로운 시작입니다."
        priority
        width={300}
        height={121}
        className="object-contain"
      />

      <div className="flex gap-2 text-20 text-white md:text-24">
        <span className="font-normal">제작</span>
        <strong className="font-bold">Photobit</strong>
      </div>
    </section>
  );
}
