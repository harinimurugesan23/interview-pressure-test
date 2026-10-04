import { CheckCircle2, AlertCircle } from 'lucide-react';

interface FeedbackCardProps {
  strength: string;
  improvement: string;
}

export function FeedbackCard({ strength, improvement }: FeedbackCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-900">Quick Feedback</h4>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm text-slate-700">
            <span className="font-medium text-emerald-700">Strong point:</span>{' '}
            {strength}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-slate-700">
            <span className="font-medium text-amber-700">Could improve:</span>{' '}
            {improvement}
          </p>
        </div>
      </div>
    </div>
  );
}
