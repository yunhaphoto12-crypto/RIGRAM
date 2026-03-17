'use client';

import Button from '@/components/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Header({ hasSchool = false }: { hasSchool?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const userType = segments[0];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const school = useSchoolStore((state) => state.school);
  const logout = useAuthStore((state) => state.logout);

  const schoolId = school?.id;

  const handleMenuDrop = () => {
    setIsOpen(!isOpen);
  };

  const handleSchoolPage = () => {
    router.replace(`/${userType}/${schoolId}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('schoolId');
    localStorage.removeItem('userType');
    logout();
    router.replace('/auth/login');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      role="banner"
      className="flex flex-row-reverse justify-between items-center w-full min-h-14 bg-gray-100 px-5 shadow-dropdown md:min-h-16 md:px-10"
    >
      <nav className="relative shrink-0">
        <Button
          onClick={handleMenuDrop}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="header-menu"
        >
          <figure className="flex justify-start items-center gap-2">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              <Image
                src="/images/logo_icon.png"
                alt="리그램 로고"
                fill
                priority
                sizes="(max-width: 768px): 24px, 32px"
                className="object-contain"
              />
            </div>
            <figcaption className="text-16 md:text-18 text-gray-900 font-semibold">
              RIGRAM
            </figcaption>
          </figure>
        </Button>

        <ul
          ref={dropdownRef}
          id="header-menu"
          role="menu"
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 flex flex-col items-center bg-white border border-gray-500 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          {school && school?.school_name ? (
            <li
              className="flex justify-center items-center whitespace-nowrap px-1.5 py-1 text-14 border-b border-b-gray-500 hover:bg-gray-200 md:px-3 md:py-2 md:text-16"
              role="menuitem"
            >
              <Button onClick={handleSchoolPage}>학교 페이지로 이동</Button>
            </li>
          ) : null}
          <li
            className="flex justify-center items-center whitespace-nowrap px-1.5 py-1 text-14 hover:bg-gray-200 md:px-3 md:py-2 md:text-16"
            role="menuitem"
          >
            <Button onClick={handleLogout}>로그아웃</Button>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300">
        {hasSchool && school ? (
          <>
            <span className="text-14 md:text-18 text-gray-500 font-medium">관리 중</span>
            <span className="w-1 h-1 rounded-full bg-green" aria-hidden="true"></span>
            <div className="text-14 md:text-18 text-gray-700 font-medium flex items-center gap-1 max-w-[150px] md:max-w-full overflow-hidden">
              {school.school_name && <span className="truncate">{school?.school_name}</span>}
              {school.graduation_year && (
                <span className="shrink-0">({school?.graduation_year})</span>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="text-14 md:text-18 text-gray-500 font-medium">관리 중인 앨범</span>
            <span className="w-1 h-1 rounded-full bg-green" aria-hidden="true"></span>
            <span className="text-14 md:text-18 text-gray-700 font-medium">선택 중</span>
          </>
        )}
      </div>
    </header>
  );
}
