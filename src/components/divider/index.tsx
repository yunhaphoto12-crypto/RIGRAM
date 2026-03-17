interface DividerProps {
  gap?: number;
  mdGap?: number;
}

export default function Divider({ gap, mdGap }: DividerProps) {
  return (
    <span
      className={`inline-block w-full h-px bg-border my-${gap} md:my-${mdGap}`}
      aria-hidden="true"
    ></span>
  );
}
