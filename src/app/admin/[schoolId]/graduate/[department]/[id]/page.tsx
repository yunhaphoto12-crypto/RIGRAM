'use client';

import Button from '@/components/button';
import OverlayViewer from '@/components/overlayViewer';
import PageHeader from '@/components/pageHeader';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useStudentStore } from '@/store/useStudentStore';
import { supabase } from '@/utils/supabase/client';
import { BookOpenText, Calendar, Mail, PencilLine, Phone, Trash, User } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function GraduateDepartmentPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const deptId = segments[3];
  const studentId = segments[4];

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const { student, fetchStudentById, isLoading, error, deleteStudentProfile } = useStudentStore();
  const fetchDepartmentById = useDepartmentStore((state) => state.fetchDepartmentById);
  const departments = useDepartmentStore((state) => state.departments);
  const school = useSchoolStore((state) => state.school);

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
      fetchDepartmentById(deptId);
    }
  }, [deptId, fetchDepartmentById, fetchStudentById, studentId]);

  const department = useMemo(() => departments.find((d) => d.id === deptId), [departments, deptId]);

  const deleteStudentFromStorage = async (
    schoolNameEn: string,
    deptNameEn: string,
    studentNameEn: string
  ) => {
    const folderPath = `${schoolNameEn}/${deptNameEn}/${studentNameEn}`;
    const subfolders = ['profile', 'graduation'];

    // 하위 폴더부터 삭제
    for (const sub of subfolders) {
      const { data: subFiles, error: subError } = await supabase.storage
        .from('student-profiles')
        .list(`${folderPath}/${sub}`);
      if (subError) {
        console.error(`${sub} 폴더 조회 실패:`, subError.message);
        continue;
      }

      if (subFiles && subFiles.length > 0) {
        const paths = subFiles.map((sf) => `${folderPath}/${sub}/${sf.name}`);
        const { error: removeError } = await supabase.storage
          .from('student-profiles')
          .remove(paths);
        if (removeError) {
          console.error(`${sub} 폴더 파일 삭제 실패:`, removeError.message);
        } else {
          console.log(`${sub} 폴더 내 파일 삭제 완료`);
        }
      }
    }

    // 상위 폴더의 루트에 파일이 있을 경우 삭제
    const { data, error } = await supabase.storage
      .from('student-profiles')
      .list(folderPath, { limit: 100 });

    if (error) {
      console.error('상위 폴더 조회 실패:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const filePaths = data.map((f) => `${folderPath}/${f.name}`);
      const { error: removeError } = await supabase.storage
        .from('student-profiles')
        .remove(filePaths);
      if (removeError) {
        console.error('상위 폴더 파일 삭제 실패:', removeError.message);
      } else {
        console.log('상위 폴더 파일 삭제 완료:', folderPath);
      }
    }
  };

  const handleGraduateDelete = async () => {
    if (confirm(`${student?.name} 졸업생의 정보를 삭제하시겠습니까? `)) {
      await deleteStudentFromStorage(
        school?.school_name_en || '',
        department?.name_en || '',
        student?.name_en || ''
      );

      const success = await deleteStudentProfile(studentId);
      if (success) {
        alert(`${student?.name} 졸업생의 정보가 삭제되었습니다.`);
        router.replace(`${pathname.slice(0, pathname.lastIndexOf('/'))}`);
      }
    }
  };

  // 에러 발생했을 때
  if (error) {
    return <div className="p-10 text-center text-red-500">에러: {error}</div>;
  }

  // student 데이터가 아직 없을 때
  if (!student || isLoading) {
    return <div className="p-10 text-center">학생 데이터를 불러오는 중 입니다.</div>;
  }

  return (
    <>
      <PageHeader title="졸업생 상세 정보" />
      <section className="relative w-full h-full border border-border rounded-xl shadow-dropdown overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-40 z-0">
          <div className="relative w-full h-full">
            {department?.img_url && (
              <Image
                src={department?.img_url}
                alt={`${department?.name} 학과대표이미지`}
                fill
                sizes="(max-width: 768px) 100% 100%"
                className="object-cover"
              />
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-4 justify-start items-start w-full h-full pt-20 pb-5 px-5 md:px-10 md:pt-35 md:pb-10">
          <div className="relative flex flex-col justify-center items-center gap-2 w-full md:gap-4 md:justify-start md:items-end md:flex-row">
            <div className="flex justify-start items-center gap-1">
              <div className="w-30 h-30 bg-white p-1 rounded-4xl overflow-hidden">
                <div
                  className="relative w-full h-full rounded-4xl"
                  onClick={() => {
                    if (student?.profile_default) setSelectedPhoto(student.profile_default);
                  }}
                >
                  {student?.profile_default && (
                    <Image
                      src={student?.profile_default}
                      alt="증명사진"
                      fill
                      sizes="(max-width: 768px) 100% 100%"
                      className="object-cover cursor-pointer hover:opacity-70"
                    />
                  )}
                </div>
              </div>
              <div className="w-30 h-30 bg-white p-1 rounded-4xl overflow-hidden">
                <div
                  className="relative w-full h-full rounded-4xl"
                  onClick={() => {
                    if (student?.profile_graduate) setSelectedPhoto(student.profile_graduate);
                  }}
                >
                  {student?.profile_graduate && (
                    <Image
                      src={student?.profile_graduate}
                      alt="졸업사진"
                      fill
                      sizes="(max-width: 768px) 100% 100%"
                      className="object-cover cursor-pointer hover:opacity-70"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="relative md:absolute md:top-8 md:right-0 md:flex md:gap-2">
              <Button className="flex items-center gap-1 text-gray-600" href={`${pathname}/edit`}>
                <PencilLine className="w-4 h-4" aria-hidden="true" />
                <span>졸업생 수정하기</span>
              </Button>
              <Button className="flex items-center gap-1 text-red" onClick={handleGraduateDelete}>
                <Trash className="w-4 h-4" aria-hidden="true" />
                <span>졸업생 삭제하기</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h3 className="text-18 text-gray-900 font-semibold">상세 정보</h3>
            <dl className="flex flex-col gap-5">
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <BookOpenText aria-hidden="true" />
                  <span>학과명</span>
                </dt>
                <dd className="text-gray-900">{department?.name || '-'}</dd>
              </div>
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <User aria-hidden="true" />
                  <span>이름</span>
                </dt>
                <dd className="text-gray-900">{`${student.name}(${student.name_en})` || '-'}</dd>
              </div>
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <Mail aria-hidden="true" />
                  <span>이메일</span>
                </dt>
                <dd className="text-gray-900">{student.email || '-'}</dd>
              </div>
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <Phone aria-hidden="true" />
                  <span>연락처</span>
                </dt>
                <dd className="text-gray-900">{student.phone || '-'}</dd>
              </div>
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <Calendar aria-hidden="true" />
                  <span>생성일</span>
                </dt>
                <dd className="text-gray-900">{student.created_at.slice(0, 10) || '-'}</dd>
              </div>
              <div className="flex justify-start items-center gap-2 text-18 font-medium">
                <dt className="flex items-center gap-2 text-gray-600 w-26 md:w-36">
                  <Calendar aria-hidden="true" />
                  <span>수정일</span>
                </dt>
                <dd className="text-gray-900">{student.updated_at.slice(0, 10) || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <OverlayViewer media={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}
