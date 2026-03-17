'use client';

import OverlayViewer from '@/components/overlayViewer';
import PageHeader from '@/components/pageHeader';
import BottomTab from '@/components/tab/bottom';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useMediaStore } from '@/store/useMediaStore';
import { Images, Play } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

export default function PhotoListPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const currentDept = segments[3];

  const [deptName, setDeptName] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const mediaList = useMediaStore((state) => state.mediaList);
  const fetchMediaList = useMediaStore((state) => state.fetchMediaList);
  const fetchDepartmentById = useDepartmentStore((state) => state.fetchDepartmentById);

  const RENDER_MEDIA = useMemo(() => {
    return currentTab === 'all'
      ? mediaList
      : mediaList.filter((item) => item.category === currentTab);
  }, [currentTab, mediaList]);

  useEffect(() => {
    fetchMediaList(currentDept);
    fetchDepartmentById(currentDept).then((dept) => {
      setDeptName(dept?.name || '');
    });
  }, [currentDept, fetchMediaList, fetchDepartmentById]);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PageHeader title={deptName} />
      <section className="relative flex flex-col gap-2 w-full h-full bg-white rounded-xl p-5 md:p-6">
        {/* 헤더 */}
        <header className="relative flex justify-between items-center md:px-6 md:py-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-16 text-gray-900 font-semibold md:text-20">
              사진 - {currentTab === 'all' ? '전체' : currentTab}
            </h3>
            <span className="flex items-center gap-1 text-14 text-gray-700 font-medium md:text-16">
              <Images aria-hidden="true" />
              {`이미지 ${RENDER_MEDIA.filter((i) => i?.type === 'photo').length}개, 동영상 ${RENDER_MEDIA.filter((i) => i?.type === 'video').length}개`}
            </span>
          </div>
        </header>

        {/* 미디어 그리드 */}
        <ul
          className="grid grid-cols-1 gap-1 max-h-[500px] w-full overflow-y-scroll scrollbar-hide md:grid-cols-3 md:gap-2"
          role="list"
        >
          {RENDER_MEDIA.map((media, index) => {
            return (
              <li
                role="listitem"
                tabIndex={0}
                aria-label={media?.type === 'photo' ? '사진 보기' : '동영상 보기'}
                key={media?.id ?? `media-${index}`}
                className={`relative flex justify-center items-center bg-[#eee] h-[200px] rounded-lg overflow-hidden hover:cursor-pointer`}
                onClick={() => setSelectedMedia(media)}
              >
                {/* 미디어 (사진/영상) */}
                {media?.type === 'video' ? (
                  <video preload="none" poster={media.video_thumbnail || '/default-thumbnail.jpg'}>
                    <source src={media?.url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={media?.url || '/default-thumbnail.png'}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100%, 100%"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* 비디오 아이콘 */}
                {media?.type === 'video' && (
                  <div className="absolute flex justify-center items-center w-[84px] h-[84px] bg-[#51515D] text-white opacity-60 rounded-full">
                    <Play />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* 하단 탭 */}
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 min-w-fit">
          <BottomTab purpose="organization" />
        </footer>

        {/* 오버레이 뷰어 */}
        <OverlayViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      </section>
    </Suspense>
  );
}
