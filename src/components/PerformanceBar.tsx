import { scoreBarColor, scoreLabel, scoreColor } from '@/utils/scoring';

interface PerformanceBarProps {
  label: string;
  score: number;
}

export function PerformanceBar({ label, score }: PerformanceBarProps) {
  const percentage = (score / 10) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-sm font-semibold ${scoreColor(score)}`}>
          {score.toFixed(1)}/10 · {scoreLabel(score)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${scoreBarColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
