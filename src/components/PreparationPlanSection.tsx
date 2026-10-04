import type { PreparationPlan } from '@/types';
import { Calendar } from 'lucide-react';

interface PreparationPlanSectionProps {
  plan: PreparationPlan;
}

export function PreparationPlanSection({ plan }: PreparationPlanSectionProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-slate-700" />
        <h3 className="text-xl font-bold text-slate-900">3-Day Preparation Plan</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plan.days.map((day) => (
          <div
            key={day.day}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                {day.day}
              </span>
              <h4 className="text-base font-semibold text-slate-900">
                Day {day.day} — {day.title}
              </h4>
            </div>
            <ul className="mt-3 space-y-2">
              {day.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
