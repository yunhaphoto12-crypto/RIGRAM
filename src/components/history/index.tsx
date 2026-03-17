'use client';

import Button from '@/components/button';
import { useHistoryStore } from '@/store/useHistoryStore';
import type { Mode } from '@/types/mode';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface HistoryProps {
  mode: Mode;
}

export default function History({ mode }: HistoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  const { histories, fetchHistories, deleteHistory } = useHistoryStore();

  useEffect(() => {
    fetchHistories(schoolId);
  }, [schoolId, fetchHistories]);

  const toggleSelect = (id: string) => {
    setSelectedHistoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (histories.length === 0) {
      alert('삭제할 연혁이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (selectedHistoryIds.length === 0) {
      alert('선택된 연혁이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (!confirm(`${selectedHistoryIds.length}명의 연혁을 정말 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectedHistoryIds.map((id) => deleteHistory(schoolId, id)));

      await fetchHistories(schoolId);
      alert('선택된 연혁이 삭제되었습니다.');

      setSelectedHistoryIds([]);
      setIsDeleteMode(false);
      router.refresh();
    } catch (error) {
      console.error('연혁 삭제 중 오류가 발생했습니다. : ', error);
      alert('연혁 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-1.5 mb-4 md:mb-6 shrink-0">
        <h3 className="text-18 font-semibold md:text-24 md:text-gray-900">연혁</h3>
        <div className="flex justify-start items-center gap-1">
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          <span>연혁 {histories.length}개</span>
        </div>
        {mode === 'admin' && (
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`/admin/${schoolId}/introduction/history/add`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium hover:font-bold focus:font-bold active:font-bold">
                추가하기
              </span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 연혁 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? (
                <>
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  <span>선택된 연혁 삭제하기</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4" aria-hidden="true" />
                  <span>삭제하기</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide md:max-h-[520px]">
        {histories.length === 0 && <p>등록된 연혁이 없습니다.</p>}
        <div className="grid grid-cols-1 gap-2 md:gap-6">
          {histories.map((history) => {
            const isSelected = selectedHistoryIds.includes(history?.id);

            const handleClick = () => {
              if (isDeleteMode) {
                toggleSelect(history.id);
              } else {
                router.push(
                  `/${mode === 'admin' ? 'admin' : 'student'}/${schoolId}/introduction/history/${history.id}`
                );
              }
            };

            return (
              <Button key={history.id} onClick={handleClick}>
                <figure
                  className={`relative flex flex-col gap-2.5 cursor-pointer w-full h-[120px]
                  ${
                    isDeleteMode
                      ? isSelected
                        ? 'ring-4 ring-red-500'
                        : 'hover:opacity-70'
                      : 'hover:opacity-70'
                  }`}
                >
                  <Image
                    src={history.background_url || ''}
                    alt={`${history.title}`}
                    width={120}
                    height={160}
                    className="absolute top-0 right-0 bottom-0 left-0 border border-gray-300 rounded-xl object-cover w-full h-full"
                    priority={false}
                  />
                  <figcaption className="absolute top-6 left-6 z-50 flex flex-col items-start gap-1">
                    <h3 className="text-18 font-semibold text-white truncate">{history.title}</h3>
                    <span className="text-16 text-white">{history.date}</span>
                  </figcaption>

                  {isDeleteMode && (
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                    ${isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'}`}
                    />
                  )}
                </figure>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
