type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label = "Skill progress" }: ProgressBarProps) {
  const safe = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-sand"
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-coral transition-[width]" style={{ width: `${safe}%` }} />
    </div>
  );
}
