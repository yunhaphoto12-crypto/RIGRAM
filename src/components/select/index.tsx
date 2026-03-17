'use client';

import { Asterisk } from 'lucide-react';

interface SelectProps {
  purpose?: 'year' | 'category';
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  labelClass?: string;
  SelectClass?: string;
  OptionClass?: string;
  onChange?: (value: string) => void;
}

export default function Select({
  purpose,
  id,
  // name,
  label,
  value,
  defaultValue,
  labelClass,
  SelectClass,
  OptionClass,
  onChange,
}: SelectProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 20 + i);
  const categories = ['팀', '단체', '동아리', '행사'];

  const options =
    purpose === 'year'
      ? years.map((year) => ({ value: String(year), label: `${year}년` }))
      : categories.map((category) => ({ value: category, label: category }));

  return (
    <div className="flex justify-start items-center">
      {label && (
        <div className={`flex items-center gap-0.5 ${labelClass || ''}`}>
          <label htmlFor={id} className="whitespace-nowrap">
            {label}
          </label>
          <Asterisk className="text-red w-4 h-4" />
        </div>
      )}
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className={`border border-gray-500 rounded-lg text-gray-500 font-medium px-2.5 h-[40px] md:px-4.5 md:h-[50px] hover:border-primary-700 focus:border-primary-700 active:border-primary-700 ${SelectClass || ''}`}
      >
        <option value="" disabled>
          {defaultValue || '선택해주세요.'}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className={`text-gray-900 ${OptionClass || ''}`}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
