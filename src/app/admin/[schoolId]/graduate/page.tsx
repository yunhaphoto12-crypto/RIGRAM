'use client';

import Card from '@/components/card';
import { useCollegeStore } from '@/store/useCollegeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function GraduatePage() {
  const pathname = usePathname();
  const school = useSchoolStore((state) => state.school);
  const colleges = useCollegeStore((state) => state.colleges);
  const fetchColleges = useCollegeStore((state) => state.fetchColleges);
  const departments = useDepartmentStore((state) => state.departments);
  const fetchDepartments = useDepartmentStore((state) => state.fetchDepartments);

  const school_id = school?.id;
  const graduationYear = school?.graduation_year;

  /* 학교 정보 fetch(학교 변경 시 한 번만 실행) */
  useEffect(() => {
    if (school_id) fetchColleges(school_id);
  }, [school_id, fetchColleges]);

  /* 학과 정보 fetch(대학 목록이 갱신될 때만 실행) */
  useEffect(() => {
    if (colleges.length > 0) {
      colleges.forEach((college) => fetchDepartments(college.id));
    }
  }, [colleges, fetchDepartments]);

  /* 렌더링 최적화 : useMemo을 사용한 필터 + 정렬 결과를 메모이제이션 */
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => dept.graduation_year === graduationYear)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [departments, graduationYear]);

  return (
    <section
      className="flex flex-col gap-4 w-full h-full bg-white rounded-xl p-5 md:p-6"
      aria-labelledby="graduate-heading"
    >
      <h1 id="graduate-heading" className="sr-only">
        졸업생 학과 선택 페이지
      </h1>

      <header role="banner" aria-label="졸업생 추가 안내">
        <h2 className="text-20 font-semibold md:text-24 md:font-bold">
          추가할 졸업생의 학과를 선택하세요.
        </h2>
      </header>
      <div
        role="list"
        className="grid grid-col-1 gap-4 flex-1 h-full overflow-y-auto scrollbar-hide md:grid-cols-3 md:gap-6 md:max-h-[700px]"
      >
        {filteredDepartments.map((dept) => (
          <Card
            role="listitem"
            key={dept.id}
            title={dept.name}
            subTitle={dept.name_en}
            imgSrc={dept.img_url || undefined}
            href={`${pathname}/${dept.id}`}
            aria-label={`${dept.name} 학과 선택`}
          />
        ))}
        {filteredDepartments.length === 0 && (
          <p
            className="text-gray-500 text-center col-span-full py-8"
            role="status"
            aria-live="polite"
          >
            현재 선택 가능한 학과가 없습니다.
            <br />
            학과를 추가해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}
