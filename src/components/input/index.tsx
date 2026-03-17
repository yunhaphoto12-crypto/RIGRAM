interface InputProps {
  purpose: 'id' | 'password' | 'search' | 'text' | 'date';
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  purpose,
  id,
  name,
  placeholder,
  value,
  className,
  required = false,
  onChange,
  min,
  max,
  disabled = false,
  readOnly = false,
}: InputProps) {
  const getConfig = () => {
    switch (purpose) {
      case 'id':
        return {
          type: 'email',
          placeholder: '아이디',
          defaultId: 'userId',
          defaultName: 'userId',
          required: true,
        };
      case 'password':
        return {
          type: 'password',
          placeholder: '비밀번호',
          defaultId: 'userPassword',
          defaultName: 'userPassword',
          required: true,
        };
      case 'search':
        return {
          type: 'text',
          placeholder: '검색',
          defaultId: 'Search',
          defaultName: 'Search',
        };
      case 'date':
        return {
          type: 'date',
          placeholder: placeholder,
          defaultId: 'date',
          defaultName: 'date',
        };
      default:
        return {
          type: 'text',
          placeholder: placeholder,
          defaultId: 'input',
          defaultName: 'input',
          className: 'bg-gray-100 ',
        };
    }
  };
  const config = getConfig();

  return (
    <input
      id={id || config.defaultId}
      name={name || config.defaultName}
      type={config.type}
      placeholder={config.placeholder}
      value={value ?? ''}
      required={required}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      minLength={min}
      maxLength={max}
      className={`border border-gray-500 rounded-lg px-2.5 py-2 h-[40px] md:px-4.5 md:py-4 md:h-[50px] hover:border-primary-700 focus:border-primary-700 active:border-primary-700  
        ${
          purpose === 'id' || purpose === 'password' || purpose === 'search'
            ? 'bg-white'
            : 'bg-gray-100'
        }
        ${className || ''}
        `}
    />
  );
}
