import type { Student } from '@/types/student';
import Image from 'next/image';

interface ProfileProps extends Student {
  onClick: () => void;
  role: string;
  tabIndex: number;
}

export default function Profile({
  // id,
  // school_id,
  // dept_id,
  name,
  // name_en,
  // graduation_year,
  profile_default,
  profile_graduate,
  // created_at,
  // updated_at,
  onClick,
  role,
  tabIndex,
}: ProfileProps) {
  return (
    <div
      className="flex flex-col gap-4 p-4 bg-white border border-border rounded-xl"
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
    >
      <div className="flex gap-3 justify-center items-center w-full overflow-hidden">
        <div className="relative w-1/2 h-35 rounded-sm ">
          <Image
            src={profile_default}
            alt={`${name}의 증명사진`}
            fill
            sizes="(max-width: 768px) w-1/2 h-35"
            className="object-cover"
          />
        </div>
        <div className="relative w-1/2 h-35 rounded-sm ">
          <Image
            src={profile_graduate}
            alt={`${name}의 졸업사진`}
            fill
            sizes="(max-width: 768px) w-1/2 h-35"
            className="object-cover"
          />
        </div>
      </div>
      <span className="text-18 text-gray-900 font-semibold">{name}</span>
    </div>
  );
}
