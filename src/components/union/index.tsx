'use client';

import Button from '@/components/button';
import { useUnionStore } from '@/store/useUnionStore';
import type { Mode } from '@/types/mode';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface UnionProps {
  mode: Mode;
}

export default function DepartmentUnionPage({ mode }: UnionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];
  const departmentId = segments[3];

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedUnionIds, setSelectedUnionIds] = useState<string[]>([]);

  const { unions, fetchUnions, deleteUnion } = useUnionStore();

  useEffect(() => {
    fetchUnions(departmentId);
  }, [departmentId, fetchUnions]);

  const toggleSelect = (id: string) => {
    setSelectedUnionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteButton = async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (unions.length === 0) {
      alert('삭제할 학생회의 학생이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (selectedUnionIds.length === 0) {
      alert('선택된 학생회의 학생이 없습니다.');
      setIsDeleteMode(false);
      return;
    }
    if (!confirm(`${selectedUnionIds.length}명의 학생회의 학생을 정말 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(selectedUnionIds.map((id) => deleteUnion(departmentId, id)));

      await fetchUnions(departmentId);
      alert('선택된 학생회 학생이 삭제되었습니다.');

      setSelectedUnionIds([]);
      setIsDeleteMode(false);
      router.refresh();
    } catch (error) {
      console.error('학생회 삭제 중 오류가 발생했습니다. : ', error);
      alert('학생회 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const getRoleLabel = (role: string) => {
    const r = role.toLowerCase();
    switch (r) {
      case 'student council president':
        return '학생회장';
      case 'vice student council president':
        return '부학생회장';
      case 'manager':
        return '부장';
      case 'conductor':
        return '차장';
      case 'member':
        return '부원';
      default:
        return role;
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-1.5 mb-4 md:mb-6">
        <h3 className="text-18 font-semibold md:text-24 md:text-gray-900">학생회</h3>
        <div className="flex justify-start items-center gap-1">
          <ImageIcon className="w-4 h-4" aria-hidden="true" />
          <span>{unions.length}명의 학생회</span>
        </div>
        {mode === 'admin' && (
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              className="flex items-center gap-1 text-gray-600"
              href={`/admin/${schoolId}/department/${departmentId}/union/add`}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium hover:font-bold focus:font-bold active:font-bold">
                추가하기
              </span>
            </Button>
            <Button
              className="flex items-center gap-1 text-red"
              onClick={handleDeleteButton}
              aria-label={isDeleteMode ? '선택한 학생회 삭제' : '삭제 모드 전환'}
            >
              {isDeleteMode ? (
                <>
                  <Trash className="w-4 h-4" aria-hidden="true" />
                  <span>선택된 학생회 삭제하기</span>
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
        {unions.length === 0 && <p>등록된 학생회 학생이 없습니다.</p>}
        <div className="grid grid-cols-3 gap-2 md:grid-cols-7 md:gap-6">
          {unions.map((union) => {
            const isSelected = selectedUnionIds.includes(union.id);

            return (
              <figure
                key={union.id}
                className={`flex flex-col gap-2.5 cursor-pointer relative
                ${
                  isDeleteMode
                    ? isSelected
                      ? 'ring-4 ring-red-500'
                      : 'hover:opacity-70'
                    : 'hover:scale-105 hover:opacity-70'
                }`}
                onClick={() => isDeleteMode && toggleSelect(union.id)}
              >
                <Image
                  src={union.profile_url || ''}
                  alt={`${union.name} 프로필 사진`}
                  width={120}
                  height={160}
                  className="border border-gray-300 rounded-xl object-cover w-[120px] h-[160px]"
                  priority={false}
                />
                <figcaption className="flex flex-col gap-1">
                  <h3 className="text-18 font-semibold text-gray-800 truncate">{union.name}</h3>
                  <span className="text-16 text-gray-600">{getRoleLabel(union.position)}</span>
                </figcaption>

                {isDeleteMode && (
                  <div
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center 
                  ${isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'}`}
                  />
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </>
  );
}
