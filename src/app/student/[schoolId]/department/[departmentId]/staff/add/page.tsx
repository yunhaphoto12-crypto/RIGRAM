'use client';

import Badge from '@/components/badge';
import Button from '@/components/button';
import FileInput from '@/components/fileInput';
import Input from '@/components/input';
import PageHeader from '@/components/pageHeader';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useStaffStore } from '@/store/useStaffStore';
import { supabase } from '@/utils/supabase/client';
import { Asterisk } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: 'professor', label: '교수' },
  { value: 'associate professor', label: '부교수' },
  { value: 'assistant professor', label: '조교수' },
  { value: 'instructor', label: '강사' },
  { value: 'assistant', label: '조교' },
];
type Category =
  | 'professor'
  | 'associate professor'
  | 'assistant professor'
  | 'instructor'
  | 'assistant';

export default function StaffAddPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const schoolId = segments[1];
  const departmentId = segments[3];

  const [deptNameEn, setDeptNameEn] = useState('');
  const [category, setCategory] = useState<Category>('professor');
  const [name, setName] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const addStaffProfile = useStaffStore((state) => state.addStaffProfile);
  const school = useSchoolStore((state) => state.school);
  const schoolNameEn = school?.school_name_en || '';
  const fetchDepartmentById = useDepartmentStore((state) => state.fetchDepartmentById);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  useEffect(() => {
    if (!departmentId) return;

    const loadDepartment = async () => {
      try {
        const dept = await fetchDepartmentById(departmentId);
        if (dept?.name_en) {
          setDeptNameEn(dept.name_en);
        }
      } catch (error) {
        console.error('Department 조회 실패:', error);
      }
    };

    loadDepartment();
  }, [departmentId, fetchDepartmentById]);

  /* 파일 업로드 (Supabase Storage) */
  const uploadFile = useCallback(
    async (file: File, folder: Category) => {
      const schoolName = slugify(schoolNameEn);
      const departmentName = slugify(deptNameEn);

      const filePath = `${schoolName}/${departmentName}/${folder}/${file.name}`;

      const { error } = await supabase.storage
        .from('staff-profiles')
        .upload(filePath, file, { upsert: true });
      if (error) {
        console.error(`프로필 업로드 실패:`, error.message);
        alert(`프로필 업로드 중 오류가 발생했습니다.`);
        return null;
      }

      const { data } = supabase.storage.from('staff-profiles').getPublicUrl(filePath);

      return data.publicUrl ?? null;
    },
    [schoolNameEn, deptNameEn]
  );

  const handleAddProfile = useCallback(
    () => async () => {
      if (!mediaFile) {
        alert('프로필 이미지를 업로드해 주세요.');
        return;
      }

      try {
        const mediaUrl = await uploadFile(mediaFile, category);
        if (!mediaUrl) return;

        await addStaffProfile(schoolId, departmentId, name, category, mediaUrl);

        alert('교직원이 성공적으로 추가되었습니다.');
        router.replace(`/admin/${schoolId}/department/${departmentId}?tab=staff`);
      } catch (error) {
        console.error('교직원 추가 중 오류가 발생 :', error);
        alert('교직원 추가 중 오류가 발생했습니다.');
        return;
      }
    },
    [addStaffProfile, schoolId, departmentId, name, category, mediaFile, router, uploadFile]
  );

  return (
    <>
      <PageHeader title="교직원 추가하기" />
      <section className="relative bg-white w-full p-4 md:p-10 border border-gray-200 rounded-xl shadow-dropdown md:w-[1080px] md:min-h-[753px]">
        <header className="relative flex flex-col justify-start gap-1">
          <ol className="flex justify-start items-center">
            <li>
              <Badge active>교직원 추가</Badge>
            </li>
          </ol>
          <h3 className="text-24 text-gray-900 font-semibold">교직원 추가</h3>
          <div className="absolute right-0 bottom-0 flex items-center gap-2">
            <Button
              className="text-white bg-primary-700 rounded-lg px-3 py-1.5"
              onClick={handleAddProfile()}
            >
              추가하기
            </Button>
          </div>
        </header>
        <span className="inline-block w-full h-px bg-gray-200 my-8" aria-hidden="true"></span>
        <form className="flex flex-col gap-6">
          {/* 카테고리 선택 */}
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="category"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              카테고리
              <Asterisk className="text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <select
                id="category"
                className="w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                교직원 선택
              </select>
            </div>
          </div>
          {/* 이름 업로드 */}
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="name"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              이름
              <Asterisk className="text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="name"
                placeholder="이름을 입력해 주세요 (80자 제한)"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={true}
              />
            </div>
          </div>
          {/* 프로필 사진 업로드 */}
          <div className="flex justify-start items-start">
            <label
              htmlFor="media-upload"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[100px] md:text-18 md:w-[200px]"
            >
              프로필 이미지 업로드
              <Asterisk className="text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <FileInput
                id="media-upload"
                size="lg"
                multiple={false}
                value={mediaFile}
                onChange={(files) => {
                  if (!files) return;
                  const file = files instanceof FileList ? files[0] : files;
                  setMediaFile(file);
                }}
              />
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
