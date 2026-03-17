import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

interface CardProps {
  href?: string;
  title?: string;
  subTitle?: string;
  imgSrc?: string;
  variant?: 'default' | 'add';
  role?: string;
}

export default function Card({
  href = '#',
  title = '',
  subTitle = '',
  imgSrc,
  variant = 'default',
  role,
}: CardProps) {
  const isAddVariant = useMemo(() => variant === 'add', [variant]);

  if (isAddVariant) {
    return (
      <Link
        href={href}
        role={role}
        className="flex justify-center items-center h-40 md:h-64 w-full rounded-xl border border-gray-300 shadow-dropdown overflow-hidden hover:font-bold hover:border-gray-500 focus:font-bold focus:border-gray-500 active:font-bold active:border-gray-500"
        aria-label="새 학과 추가하기"
      >
        <div className="flex items-center gap-1 text-gray-500">
          <Plus aria-hidden="true" />
          <span>학과 추가하기</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      role={role}
      href={href || '#'}
      className="flex flex-row md:flex-col h-40 md:h-64 w-full rounded-xl border border-gray-300 shadow-dropdown overflow-hidden hover:font-bold hover:border-gray-500 focus:font-bold focus:border-gray-500 active:font-bold active:border-gray-500"
    >
      <div className="relative w-1/2 md:w-full md:h-38 shrink-0">
        <Image
          src={imgSrc || '/images/default-dept.png'}
          alt={title || '학과 이미지'}
          fill
          sizes="(max-width: 768px) 50%, 100% 152px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 px-5 py-4">
        <h3 className="text-gray-800" aria-label={title}>
          {title}
        </h3>
        <p className="text-gray-500" aria-label={subTitle}>
          {subTitle}
        </p>
      </div>
    </Link>
  );
}
