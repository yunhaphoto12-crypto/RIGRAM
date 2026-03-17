'use client';

import Button from '@/components/button';
import OverlayViewer from '@/components/overlayViewer';
import { useForegroundStore } from '@/store/useForegroundStore';
import type { Mode } from '@/types/mode';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface ForegroundProps {
  mode: Mode;
}

export default function Foreground({ mode }: ForegroundProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectForegroundIds, setSelectForegroundIds] = useState<string[]>([]);

  const { foregroundList, fetchForegroundList, deleteForeground } = useForegroundStore();

  useEffect(() => {
    fetchForegroundList(schoolId);
  }, [fetchForegroundList, schoolId]);

  const toggleSelect = (id: string) => {
    setSelectForegroundIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (foregroundList.length === 0) {
      alert('삭제할 전경 이미지가 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (selectForegroundIds.length === 0) {
      alert('선택된 전경 이미지가 없습니다.');
      setIsDeleteMode(false);
      return;
    }

    if (!confirm(`${selectForegroundIds.length}개의 전경 이미지를 정말 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectForegroundIds.map((id) => deleteForeground(schoolId, id)));
      await fetchForegroundList(schoolId);
      alert('선택된 전경 이미지가 삭제되었습니다.');

      setSelectForegroundIds([]);
      setIsDeleteMode(false);
      router.refresh();
    } catch (error) {
      console.error('전경 이미지 삭제 중 오류가 발생했습니다. : ', error);
      alert('전경 이미지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-1.5 mb-4 md:mb-6">
        <h3 className="text-18 font-semibold md:text-24 md:text-gray-900">전경</h3>
        <div className="flex justify-start items-center gap-1">
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          <span>{foregroundList.length}개의 이미지</span>
        </div>
        {mode === 'admin' && (
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`/admin/${schoolId}/introduction/foreground/add`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium hover:font-bold focus:font-bold active:font-bold">
                추가하기
              </span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 전경 이미지 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? (
                <>
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  <span>선택된 전경 이미지 삭제하기</span>
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
      <div className="flex-1 overflow-y-auto scrollbar-hide md:max-h-[520px] ">
        {foregroundList.length === 0 && <p>등록된 전경 이미지가 없습니다.</p>}
        <ul className="grid grid-cols-1 gap-1 w-full md:grid-cols-3 md:gap-2" role="list">
          {foregroundList.map((foreground) => {
            const isSelected = selectForegroundIds.includes(foreground?.id);

            return (
              <li
                role="listitem"
                tabIndex={0}
                key={foreground.id ?? `foreground-${foreground.id}`}
                className={`relative flex flex-col gap-1 justify-center items-center rounded-lg overflow-hidden hover:cursor-pointer
                  ${
                    isDeleteMode
                      ? isSelected
                        ? 'ring-4 ring-red-500'
                        : 'hover:opacity-70'
                      : 'hover:scale-105 hover:opacity-70'
                  }`}
                onClick={() =>
                  isDeleteMode ? toggleSelect(foreground.id) : setSelectedPhoto(foreground)
                }
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={foreground.url || ''}
                    alt={`${foreground.title} 전경 이미지`}
                    fill
                    sizes="(max-width: 768px) 100%, 100%"
                    className="border border-gray-300 rounded-xl object-cover"
                    priority={false}
                  />
                </div>
                <p className="w-full text-16 font-semibold truncate">{foreground.title}</p>

                {isDeleteMode && (
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                        ${isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'}`}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <OverlayViewer media={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}
