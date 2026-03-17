'use client';

import Button from '@/components/button';
import Card from '@/components/card';
import { useCollegeStore } from '@/store/useCollegeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function DepartmentPage() {
  const pathname = usePathname();
  const school = useSchoolStore((state) => state.school);
  const colleges = useCollegeStore((state) => state.colleges);
  const fetchColleges = useCollegeStore((state) => state.fetchColleges);
  const departments = useDepartmentStore((state) => state.departments);
  const fetchDepartments = useDepartmentStore((state) => state.fetchDepartments);

  const school_id = school?.id;
  const school_graduation_year = school?.graduation_year;

  /* 1. 불필요한 렌더링 방지 : 의존성이 바뀔 때만 fetch 실행 */
  useEffect(() => {
    if (school_id) fetchColleges(school_id);
  }, [school_id, fetchColleges]);

  useEffect(() => {
    if (colleges.length > 0) {
      colleges.forEach((college) => {
        fetchDepartments(college.id);
      });
    }
  }, [colleges, fetchDepartments]);

  /* 2. useMemo로 필터링/정렬 최적화 : 렌더링마다 sort/filter가 재계산되지 않도록 */
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => dept.graduation_year === school_graduation_year)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [departments, school_graduation_year]);

  return (
    <section
      className="flex flex-col w-full gap-4 min-h-full md:max-h-[700px]"
      aria-labelledby="department-heading"
    >
      <h1
        id="department-heading"
        className="sr-only"
      >{`${school?.school_name} 학교 학과 리스트`}</h1>
      <header
        className="flex justify-between items-center"
        role="banner"
        aria-label="학과 목록 헤더"
      >
        <h2 className="text-20 font-semibold text-gray-900 md:text-24 md:font-bold">학과 리스트</h2>
        <Button
          className="flex items-center gap-1 px-3 py-2 text-16 text-primary-700 font-semibold"
          href={`${pathname}/add`}
          aria-label="새 학과 추가하기"
        >
          <Plus className="w-4 h-4" />
          학과 추가하기
        </Button>
      </header>
      <div
        className="grid grid-col-1 gap-6 md:grid-cols-3 h-full overflow-y-scroll scrollbar-hide"
        aria-labelledby="department-heading"
        role="list"
      >
        {filteredDepartments.map((dept) => (
          <Card
            key={dept.id}
            title={dept.name}
            subTitle={dept.name_en}
            imgSrc={dept.img_url as string}
            href={`${pathname}/${dept.id}?tab=detail`}
            aria-label={`${dept.name} 학과 상세보기`}
            role="listitem"
          />
        ))}
        <Card variant="add" href={`${pathname}/add`} aria-label="새 학과 추가 카드" />
      </div>
    </section>
  );
}
