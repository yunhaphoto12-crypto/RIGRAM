'use client';

import ExecutivePage from './executive/page';
import ForegroundPage from './foreground/page';
import HistoryPage from './history/page';
import SymbolPage from './symbol/page';
import PageHeader from '@/components/pageHeader';
import BottomTab from '@/components/tab/bottom';
import { useSchoolStore } from '@/store/useSchoolStore';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

export default function IntroductionPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab');
  const { activeTab } = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return {
      schoolId: segments[1],
      activeTab: tabParam,
    };
  }, [pathname, tabParam]);

  const { school } = useSchoolStore();

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PageHeader title={`${school?.school_name} 소개`} />
      <section
        className="relative w-full h-full bg-white rounded-xl p-4 border border-border md:max-h-[728px] md:p-10"
        aria-labelledby="school-info"
      >
        {activeTab === 'foreground' && <ForegroundPage />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'symbol' && <SymbolPage />}
        {activeTab === 'executive' && <ExecutivePage />}

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 min-w-fit">
          <BottomTab purpose="school_intro" />
        </footer>
      </section>
    </Suspense>
  );
}
