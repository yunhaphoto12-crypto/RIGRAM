'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import PageHeader from '@/components/pageHeader';
import Profile from '@/components/profile';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useStudentStore } from '@/store/useStudentStore';
import { ListFilter, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function GraduateDepartmentStudentList() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const departmentId = segments[3];

  const [deptName, setDeptName] = useState<string>('');
  const [deptGraduationYear, setDeptGraduationYear] = useState<string>('');
  const [searchable, setSearchable] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  const fetchDepartmentById = useDepartmentStore((state) => state.fetchDepartmentById);
  const { students, fetchStudents, isLoading } = useStudentStore();

  /* 학과 정보 가져오기 */
  useEffect(() => {
    if (!departmentId) return;

    fetchDepartmentById(departmentId).then((dept) => {
      setDeptName(dept?.name || '');
      setDeptGraduationYear(dept?.graduation_year || '');
    });
  }, [departmentId, fetchDepartmentById]);

  /* 졸업생 리스트 가져오기 */
  useEffect(() => {
    if (departmentId) fetchStudents(departmentId);
  }, [departmentId, fetchStudents]);

  const handleGoProfile = useCallback(
    (id: string) => {
      router.push(`${pathname}/${id}`);
    },
    [router, pathname]
  );

  const handleListFilter = useCallback(() => {
    setIsSorted((prev) => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchable(!searchable);
    setKeyword('');
  }, [searchable]);

  const filteredStudents = useMemo(() => {
    let list = students.slice();

    // 검색
    if (keyword.trim()) {
      list = list.filter((s) => s.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    // 정렬
    if (isSorted) {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
    }

    return list;
  }, [students, keyword, isSorted]);

  return (
    <>
      <PageHeader title={deptName} />
      <section
        className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10"
        role="region"
        aria-label={`${deptName || '학과'} 졸업생 목록`}
      >
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">졸업생 리스트</h1>
            <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center gap-2 text-gray-600 md:gap-4">
                <Button onClick={handleListFilter}>
                  <ListFilter
                    className="hover:cursor-pointer hover:font-bold focus:font-bold active:font-bold"
                    aria-label="졸업생 정렬"
                  />
                </Button>
                {searchable ? (
                  <Input
                    purpose="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="이름 검색"
                  />
                ) : null}
                <Button onClick={handleSearch}>
                  <Search
                    className="hover:cursor-pointer hover:font-bold focus:font-bold active:font-bold"
                    aria-label="졸업생 검색"
                  />
                </Button>
              </div>
              <Button
                className="text-white bg-primary-700 text-16 rounded-lg px-3 py-2 hover:font-bold focus:font-bold active:font-bold"
                href={`${pathname}/add`}
              >
                졸업생 추가하기
              </Button>
            </div>
          </header>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4" role="list">
            {isLoading ? (
              <li className="col-span-full text-center text-gray-500">불러오는 중...</li>
            ) : filteredStudents.length > 0 ? (
              filteredStudents
                .filter((data) => data.graduation_year === deptGraduationYear)
                .map((student) => (
                  <li
                    key={student.id}
                    className="hover:cursor-pointer hover:outline hover:outline-primary-700 focus:outline focus:outline-primary-700 active:outline active:outline-primary-700"
                  >
                    <Profile
                      {...student}
                      onClick={() => handleGoProfile(student.id)}
                      role="button"
                      tabIndex={0}
                    />
                  </li>
                ))
            ) : (
              <p className="col-span-full text-center text-gray-500">등록된 졸업생이 없습니다.</p>
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
