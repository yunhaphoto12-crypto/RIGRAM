interface BadgeProps {
  children: React.ReactNode;
  active?: boolean;
}

export default function Badge({ children, active = false }: BadgeProps) {
  return (
    <span
      className={`text-16 px-1.5 py-1 rounded-sm ${active ? 'bg-gray-200 text-gray-700 font-bold' : 'bg-white text-gray-600 font-normal'}`}
    >
      {children}
    </span>
  );
}
