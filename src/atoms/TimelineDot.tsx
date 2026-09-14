export interface TimelineDotProps {
  color: string;
  className?: string;
}

export function TimelineDot({ color, className }: TimelineDotProps) {
  return (
    <span
      className={className ?? 'absolute -left-5 top-[5px] h-[9px] w-[9px] rounded-full border-2 border-white'}
      style={{ background: color, boxShadow: `0 0 0 1px ${color}` }}
    />
  );
}
