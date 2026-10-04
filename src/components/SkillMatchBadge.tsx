import type { SkillMatch } from '@/types';
import { Check, Minus, X } from 'lucide-react';

interface SkillMatchBadgeProps {
  match: SkillMatch;
}

export function SkillMatchBadge({ match }: SkillMatchBadgeProps) {
  const config = {
    strong: {
      icon: Check,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Strong match',
    },
    partial: {
      icon: Minus,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Partial match',
    },
    missing: {
      icon: X,
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Missing skill',
    },
  };

  const c = config[match.level];
  const Icon = c.icon;

  return (
    <div className={`flex items-center gap-2 rounded-lg border ${c.border} ${c.bg} px-3 py-2`}>
      <Icon className={`h-4 w-4 shrink-0 ${c.text}`} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{match.skill}</p>
        <p className={`text-xs ${c.text}`}>{c.label}</p>
      </div>
    </div>
  );
}
