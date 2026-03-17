import './globals.css';
import Button from '@/components/button';
import { CircleAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: '페이지를 찾을 수 없습니다.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full">
      <CircleAlert className="w-10 h-10 md:w-20 md:h-20" />
      <h1 className="text-6xl font-bold md:text-7xl">404</h1>
      <p className="text-20 md:text-24">페이지를 찾을 수 없습니다.</p>
      <Button
        href="/"
        className="text-white rounded-lg px-6 py-3 bg-primary-700 hover:font-bold focus:font-bold active:font-bold"
      >
        홈으로 돌아가기
      </Button>
    </div>
  );
}
