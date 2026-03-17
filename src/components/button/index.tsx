import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  type,
  onClick,
  href,
  className,
  disabled,
}: ButtonProps) {
  const PseudoSelectors =
    'hover:font-bold hover:outline hover:outline-primary-700 focus:font-bold focus:outline focus:outline-primary-700 focus-visible:font-bold focus-visible:outline focus-visible:outline-primary-700 active:font-bold active:outline active:outline-primary-700';

  if (href) {
    return (
      <Link
        href={href}
        className={`flex justify-center items-center ${className ?? ''} ${PseudoSelectors}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`flex justify-center items-center ${className ?? ''} ${PseudoSelectors}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
