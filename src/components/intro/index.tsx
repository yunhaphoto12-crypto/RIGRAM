'use client';

import type { Department } from '@/types/department';
import Image from 'next/image';

interface DepartmentProps {
  department: Department;
}

export default function DepartmentIntroPage({ department }: DepartmentProps) {
  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-20 text-gray-900 font-semibold" id="department-introduction">
          {department.name} 소개
        </h2>
      </header>

      {department.img_url && (
        <div className="mb-6 md:mb-8">
          <div className="relative w-full h-[200px] md:h-[280px] rounded-xl">
            <Image
              src={department.img_url}
              alt={`${department.name} 대표 이미지`}
              fill
              sizes="(max-width: 768px) 100% 200px, 100%, 280px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}
      <p className="overflow-scroll scrollbar-hide md:max-h-[300px]">{department.description}</p>
    </>
  );
}
