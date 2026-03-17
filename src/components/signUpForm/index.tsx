'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { supabase } from '@/utils/supabase/client';
import { Asterisk } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'student'>('admin');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError('비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { userType }, // Supabase 정책(RLS)에서 auth.jwt() ->> 'role' 식으로 접근 가능)
        },
      });
      if (error) throw error;

      // 회원가입 시 public.user 생성
      if (data.user) {
        let schoolId: string | null = null;

        if (userType === 'student') {
          const { data: matchedStudent, error: studentError } = await supabase
            .from('students')
            .select('school_id')
            .eq('email', email.toLowerCase())
            .single();

          if (studentError || !matchedStudent) {
            setError('등록되지 않은 학생입니다. 학교 관리자에게 문의하세요.');
            setIsLoading(false);
            return;
          }

          schoolId = matchedStudent.school_id;
        }

        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          user_email: data.user.email,
          user_type: userType,
          school_id: schoolId,
        });
        if (insertError) throw insertError;
      }

      alert(`회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.`);
      router.replace(`/auth/login`);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSignUp}>
      <div className="flex flex-col gap-4">
        <div className="flex">
          <label className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[120px] md:text-18 md:w-[200px]">
            권한
            <Asterisk className="text-red w-4 h-4" />
          </label>
          <div className="flex justify-center gap-4 mb-4">
            {['admin', 'student'].map((role) => (
              <label
                key={role}
                className={`px-6 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all duration-200
                ${
                  userType === role
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={userType === role}
                  onChange={() => setUserType(role as 'admin' | 'student')}
                  className="hidden"
                />
                {role}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-start items-center w-full">
          <label
            htmlFor="signup-email"
            className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[120px] md:text-18 md:w-[200px]"
          >
            이메일
            <Asterisk className="text-red w-4 h-4" />
          </label>
          <div className="flex-1 min-w-0">
            <Input
              purpose="id"
              id="signup-email"
              placeholder="이메일(아이디)을 적어주세요."
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
          </div>
        </div>
        <div className="flex justify-start items-center w-full">
          <label
            htmlFor="signup-password"
            className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[120px] md:text-18 md:w-[200px]"
          >
            비밀번호
            <Asterisk className="text-red w-4 h-4" />
          </label>
          <div className="flex-1 min-w-0">
            <Input
              purpose="password"
              id="signup-password"
              placeholder="비밀번호를 적어주세요."
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </div>
        </div>
        <div className="flex justify-start items-center w-full">
          <label
            htmlFor="signup-repeat-password"
            className="shrink-0 flex justify-start items-center gap-0.5 text-16 text-gray-800 w-[120px] md:text-18 md:w-[200px]"
          >
            비밀번호 확인
            <Asterisk className="text-red w-4 h-4" />
          </label>
          <div className="flex-1 min-w-0">
            <Input
              purpose="password"
              id="signup-repeat-password"
              placeholder="비밀번호를 한 번 더 적어주세요."
              className="w-full"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required={true}
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-gray-900 text-white text-18 py-4 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? '계정을 생성하는 중 입니다...' : '회원가입'}
        </Button>
        <div className="flex gap-2 mx-auto">
          <p>이미 가입이 되어 있으신가요?</p>
          <Button href="/auth/login">로그인 하러 가기</Button>
        </div>
      </div>
    </form>
  );
}
