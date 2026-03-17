'use client';

import OverlayViewer from '../overlayViewer';
import Button from '@/components/button';
import { useSymbolStore } from '@/store/useSymbolStore';
import type { Mode } from '@/types/mode';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface SymbolProps {
  mode: Mode;
}

export default function Symbol({ mode }: SymbolProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];

  const [selectedSymbol, setSelectedSymbol] = useState<any>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectSymbolIds, setSelectSymbolIds] = useState<string[]>([]);

  const { symbolList, fetchSymbolList, deleteSymbol } = useSymbolStore();

  useEffect(() => {
    fetchSymbolList(schoolId);
  }, [fetchSymbolList, schoolId]);

  const toggleSelect = (id: string) => {
    setSelectSymbolIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (symbolList.length === 0) {
      alert('삭제할 상징이 없습니다.');
      return;
    }
    if (selectSymbolIds.length === 0) {
      alert('선택된 상징이 없습니다.');
      return;
    }
    if (!confirm(`${selectSymbolIds.length}개의 상징을 정말 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectSymbolIds.map((id) => deleteSymbol(schoolId, id)));
      await fetchSymbolList(schoolId);
      alert('선택된 상징이 삭제되었습니다.');

      setSelectSymbolIds([]);
      setIsDeleteMode(false);
      router.refresh();
    } catch (error) {
      console.error('상징 삭제 중 오류가 발생했습니다. : ', error);
      alert('상징 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-1.5 mb-4 md:mb-6">
        <h3 className="text-18 font-semibold md:text-24 md:text-gray-900">상징</h3>
        <div className="flex justify-start items-center gap-1">
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          <span>{symbolList.length}개의 상징</span>
        </div>
        {mode === 'admin' && (
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`/admin/${schoolId}/introduction/symbol/add`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium hover:font-bold focus:font-bold active:font-bold">
                추가하기
              </span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 상징 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? (
                <>
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  <span>선택된 상징 삭제하기</span>
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
        {symbolList.length === 0 && <p>등록된 상징이 없습니다.</p>}
        <ul className="grid grid-cols-1 gap-1 w-full md:grid-cols-3 md:gap-2" role="list">
          {symbolList.map((symbol) => {
            const isSelected = selectSymbolIds.includes(symbol?.id);

            return (
              <li
                role="listitem"
                tabIndex={0}
                key={symbol.id ?? `foreground-${symbol.id}`}
                className={`relative flex flex-col gap-1 justify-center items-center rounded-lg overflow-hidden hover:cursor-pointer
                      ${
                        isDeleteMode
                          ? isSelected
                            ? 'ring-4 ring-red-500'
                            : 'hover:opacity-70'
                          : 'hover:scale-105 hover:opacity-70'
                      }`}
                onClick={() => (isDeleteMode ? toggleSelect(symbol.id) : setSelectedSymbol(symbol))}
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={symbol.url || ''}
                    alt={`${symbol.title} 상징`}
                    fill
                    sizes="(max-width: 768px) 100%, 100%"
                    className="border border-gray-300 rounded-xl object-cover"
                    priority={false}
                  />
                </div>
                <h3 className="w-full text-16 text-gray-900 font-semibold text-center truncate">
                  {symbol.title}
                </h3>
                <p className="w-full text-14 text-gray-500 text-center truncate">
                  {symbol.description}
                </p>

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
      {/* 오버레이 뷰어 */}
      <OverlayViewer media={selectedSymbol} onClose={() => setSelectedSymbol(null)} />
    </>
  );
}
