'use client';

interface CheckboxProps {
  purpose?: 'id' | 'photo';
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({ purpose, checked, defaultChecked, onChange }: CheckboxProps) {
  const checkboxConfig = () => {
    switch (purpose) {
      case 'id':
        return {
          id: 'id-check',
          label: '아이디 저장',
          labelClass: 'text-16 text-gray-700 cursor-pointer',
        };
      case 'photo':
        return { id: 'photo-check', label: '사진 선택', labelClass: 'sr-only' };
      default:
        return { id: 'check', label: '', labelClass: '' };
    }
  };
  const config = checkboxConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className="flex justify-start items-center gap-2">
      <input
        type="checkbox"
        id={config.id}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        className="w-6 h-6 border border-gray-500 accent-gray-900 rounded-sm bg-white text- cursor-pointer hover:accent-gray-700 focus:accent-gray-700 active:accent-gray-900"
      />
      {config.label && (
        <label htmlFor={config.id} className={config.labelClass}>
          {config.label}
        </label>
      )}
    </div>
  );
}
