'use client';

import PageHeader from '@/components/pageHeader';
import { useHistoryStore } from '@/store/useHistoryStore';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function HistoryDetailPage() {
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];
  const historyId = segments[4];

  const { history, fetchHistoryById, isLoading } = useHistoryStore();

  useEffect(() => {
    if (schoolId && historyId) {
      fetchHistoryById(schoolId, historyId);
    }
  }, [schoolId, historyId, fetchHistoryById]);

  if (isLoading) return <p>로딩 중...</p>;
  if (!history) return <p>연혁 정보를 불러올 수 없습니다.</p>;

  return (
    <>
      <PageHeader title="연혁 페이지로 돌아가기" />
      <section className="relative w-full h-full p-4 border border-border rounded-xl shadow-dropdown overflow-hidden">
        <div className="w-full mb-4 md:mb-6">
          <div className="relative w-full h-[200px] md:h-[300px] rounded-xl mb-2 md:mb-4">
            {history.background_url && (
              <Image
                src={history.background_url}
                alt={`${history.title} 대표 이미지`}
                fill
                sizes="(max-width: 768px) 100% 200px, 100%, 280px"
                className="object-contain"
                priority
              />
            )}
          </div>
          <div className="flex justify-center items-center gap-2 md:gap-4">
            <h3 className="text-16 font-bold md:text-20">{history.title}</h3>
            <span>{history.date}</span>
          </div>
        </div>
        <p className="overflow-scroll scrollbar-hide whitespace-pre-wrap text-center md:max-h-[300px]">
          {history.description}
        </p>
      </section>
    </>
  );
}
