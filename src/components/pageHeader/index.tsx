'use client';

import Button from '@/components/button';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  // const segments = pathname.split('/').filter(Boolean);
  // const currentPage = segments[2];
  // const searchParams = useSearchParams();

  // const [schoolId, setSchoolId] = useState<string | null>(null);
  // const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    // const storedId = localStorage.getItem('schoolId');
    // const userType = localStorage.getItem('userType');
    // setSchoolId(storedId);
    // setType(userType);
  }, []);

  const handleGoBack = () => {
    // const search = searchParams.toString();

    // if (pathname.endsWith('/add')) {
    //   router.replace(pathname.replace(/\/add$/, ''));
    //   return;
    // }

    if (pathname.includes('introduction')) {
      router.back();
      return;
    }
    if (pathname.includes('department')) {
      router.back();
      return;
    }

    // if (search.includes('tab=')) {
    //   router.replace(`/${type}/${schoolId}/${currentPage}`);
    //   return;
    // }

    router.back();
  };

  return (
    <div className="flex justify-start items-center gap-1 text-gray-900 md:h-10 md:py-1">
      <Button onClick={handleGoBack}>
        <ArrowLeft className="md:w-8 md:h-8" />
      </Button>
      <h3 className="text-18 font-bold md:text-20">{title}</h3>
    </div>
  );
}
