'use client';

import Badge from '@/components/badge';
import Button from '@/components/button';
import Divider from '@/components/divider';
import FileInput from '@/components/fileInput';
import Input from '@/components/input';
import PageHeader from '@/components/pageHeader';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useStudentStore } from '@/store/useStudentStore';
import { supabase } from '@/utils/supabase/client';
import { Asterisk } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function GraduateEditPage() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const departmentId = segments[3];
  const studentId = segments[4];

  const [studentName, setStudentName] = useState('');
  const [studentNameEn, setStudentNameEn] = useState('');
  const [deptName, setDeptName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  // const [profileImg, setProfileImg] = useState<File | null>(null);
  // const [graduationImg, setGraduationImg] = useState<File | null>(null);
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [profileImgUrl, setProfileImgUrl] = useState<string>('');
  const [graduationImg, setGraduationImg] = useState<File | null>(null);
  const [graduationImgUrl, setGraduationImgUrl] = useState<string>('');

  const { departments, fetchDepartmentById } = useDepartmentStore();
  const department = departments.find((d) => d.id === departmentId);
  const { student, fetchStudentById, updateStudentProfile } = useStudentStore();
  const school = useSchoolStore((state) => state.school);
  const schoolNameEn = school?.school_name_en || '';

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  // 파일 선택 handler
  const handleFileSelect = useCallback((file: File | null, type: 'profile' | 'graduation') => {
    if (!file) return;
    if (type === 'profile') {
      setProfileImg(file);
    } else {
      setGraduationImg(file);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }

    if (departmentId) {
      fetchDepartmentById(departmentId);
    }
  }, [studentId, fetchStudentById, departmentId, fetchDepartmentById]);

  useEffect(() => {
    if (student) {
      setStudentName(student.name);
      setStudentNameEn(student.name_en);
      setDeptName(department?.name || '');
      setGraduationYear(department?.graduation_year || '');
      setPhone(student.phone);
      setEmail(student.email);
      setProfileImgUrl(student.profile_default || '');
      setGraduationImgUrl(student.profile_graduate || '');
    }
  }, [student, department?.id, department?.name, department?.graduation_year]);

  const handleGraduateUpdate = async () => {
    if (!studentName.trim()) return alert('졸업생 이름을 입력해 주세요.');
    if (!studentNameEn.trim()) return alert('졸업생 영문 이름을 입력해 주세요.');
    if (!phone.trim()) return alert('연락처를 입력해 주세요.');
    if (!email.trim()) return alert('이메일을 입력해 주세요.');
    if (!profileImg) return alert('프로필 이미지를 업로드해 주세요.');
    if (!graduationImg) return alert('학사모 이미지를 업로드해 주세요.');

    try {
      let profileUrl: string | null = null;
      let graduationUrl: string | null = null;

      // 파일 경로 구성
      const schoolName = slugify(schoolNameEn);
      const departmentName = slugify(department?.name_en || '');
      const studentNameSafe = slugify(studentNameEn || 'defaultStudent');

      if (profileImg) {
        const { data, error } = await supabase.storage
          .from('student-profiles')
          .upload(
            `${schoolName}/${departmentName}/${studentNameSafe}/profile/${profileImg.name}`,
            profileImg,
            {
              upsert: true,
            }
          );
        if (error) throw error;

        // public URL 가져오기
        const { data: publicUrl } = supabase.storage
          .from('student-profiles')
          .getPublicUrl(data.path);
        profileUrl = publicUrl.publicUrl;
      }

      if (graduationImg) {
        const { data, error } = await supabase.storage
          .from('student-profiles')
          .upload(
            `${schoolName}/${departmentName}/${studentNameSafe}/graduation/${graduationImg.name}`,
            graduationImg,
            { upsert: true }
          );
        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from('student-profiles')
          .getPublicUrl(data.path);
        graduationUrl = publicUrl.publicUrl;
      }

      const updated = await updateStudentProfile(studentId, {
        name: studentName,
        name_en: studentNameEn,
        profile_default: profileUrl || student?.profile_default || '',
        profile_graduate: graduationUrl || student?.profile_graduate || '',
        email,
        phone,
      });

      if (!updated) {
        alert(`${studentName} 졸업생 프로필 수정 실패`);
        return;
      }

      alert(`${studentName} 졸업생 프로필 수정이 완료되었습니다.`);
      router.back();
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`학생 프로필 수정 중 오류가 발생했습니다. ${error}`);
    }
  };

  return (
    <>
      <PageHeader title="졸업색 수정하기" />
      <div className="bg-white w-full h-full p-5 border border-border-section rounded-xl shadow-dropdown md:w-[1080px] md:min-h-[753px] md:p-10">
        <header className="relative flex flex-col justify-start gap-1">
          <ol className="flex justify-start items-center">
            <li>
              <Badge active>졸업생 정보</Badge>
            </li>
          </ol>
          <h3 className="text-24 text-gray-900 font-semibold">졸업생 정보</h3>
          <div className="absolute right-0 bottom-0 flex items-center gap-2">
            <Button
              className="text-white bg-primary-700 rounded-lg px-3 py-1.5"
              onClick={handleGraduateUpdate}
            >
              수정하기
            </Button>
          </div>
        </header>
        <Divider gap={6} mdGap={8} />
        <div className="flex flex-col gap-6">
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="graduate-name"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              이름
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="graduate-name"
                placeholder="졸업생의 이름을 입력해 주세요.(80자 제한)"
                className="w-full"
                value={studentName}
                max={80}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  const onlyKorean = e.target.value.replace(/[^ㄱ-ㅎ가-힣ㆍ ᆢ]/gi, '');
                  setStudentName(onlyKorean);
                }}
              />
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="graduate-en-name"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] whitespace-nowrap md:text-18 md:w-[200px]"
            >
              영어 이름
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="graduate-en-name"
                placeholder="졸업생의 영어 이름을 입력해 주세요.(80자 제한)"
                className="w-full"
                value={studentNameEn}
                max={80}
                onChange={(e) => {
                  setStudentNameEn(e.target.value);
                  const onlyEnglish = e.target.value.replace(/[^A-Za-z0-9_]/g, '');
                  setStudentNameEn(onlyEnglish);
                }}
              />
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="department-name"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              학과
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="department-name"
                placeholder="학과 이름을 입력해 주세요.(80자 제한)"
                className="w-full"
                value={deptName}
                readOnly={true}
              />
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="graduation-year"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              졸업 연도
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="graduation-year"
                placeholder=""
                className="w-full"
                value={graduationYear}
                readOnly={true}
              />
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="contact"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              연락처
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="contact"
                placeholder="01012345678"
                className="w-full"
                max={11}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
                  setPhone(onlyNumber);
                }}
              />
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <label
              htmlFor="email"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              이메일
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <Input
                purpose="text"
                id="email"
                placeholder="example@email.com"
                className="w-full"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-start items-start">
            <label
              htmlFor="profile-img"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              프로필 이미지
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <FileInput
                id="profile-img"
                className="w-full h-full"
                size="lg"
                value={profileImg ? URL.createObjectURL(profileImg) : profileImgUrl}
                onChange={(files) => {
                  if (!files) return;
                  const file = files instanceof FileList ? files[0] : files;
                  handleFileSelect(file, 'profile');
                  setProfileImg(file);
                }}
              />
            </div>
          </div>
          <div className="flex justify-start items-start">
            <label
              htmlFor="graduation-img"
              className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[80px] md:text-18 md:w-[200px]"
            >
              학사모 이미지
              <Asterisk className="shrink-0 text-red w-4 h-4" />
            </label>
            <div className="flex-1 min-w-0">
              <FileInput
                id="graduation-img"
                className="w-full h-full"
                size="lg"
                value={graduationImg ? URL.createObjectURL(graduationImg) : graduationImgUrl}
                onChange={(files) => {
                  if (!files) return;
                  const file = files instanceof FileList ? files[0] : files;
                  handleFileSelect(file, 'graduation');
                  setGraduationImg(file);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
