'use client';

import Detail from '@/components/detail';
import Intro from '@/components/intro';
import PageHeader from '@/components/pageHeader';
import Staff from '@/components/staff';
import BottomTab from '@/components/tab/bottom';
import Union from '@/components/union';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

export default function DepartmentPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab');
  const { departmentId, activeTab } = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return {
      departmentId: segments[3],
      activeTab: tabParam,
    };
  }, [pathname, tabParam]);

  const { departments, isLoading } = useDepartmentStore();

  const department = useMemo(
    () => departments.find((d) => d.id === departmentId),
    [departments, departmentId]
  );

  if (isLoading) return <p>학과 데이터를 불러오는 중 입니다.</p>;
  if (!department) return <p>학과 데이터를 찾을 수 없습니다.</p>;

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PageHeader title={department.name} />
      <section
        className="relative w-full h-full bg-white rounded-xl p-4 border border-border md:max-h-[728px] md:p-10"
        aria-labelledby="department-info"
      >
        {activeTab === 'detail' && <Detail department={department} mode="student" />}
        {activeTab === 'intro' && <Intro department={department} />}
        {activeTab === 'staff' && <Staff mode="student" />}
        {activeTab === 'union' && <Union mode="student" />}

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 min-w-fit">
          <BottomTab purpose="department" />
        </footer>
      </section>
    </Suspense>
  );
}
