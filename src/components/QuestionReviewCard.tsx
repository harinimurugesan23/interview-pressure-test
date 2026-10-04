import type { QuestionResult } from '@/types';
import { PerformanceBar } from './PerformanceBar';
import { CheckCircle2, AlertCircle, XCircle, Lightbulb } from 'lucide-react';

interface QuestionReviewCardProps {
  index: number;
  result: QuestionResult;
}

const categoryLabels: Record<string, string> = {
  introduction: 'Introduction',
  resume: 'Resume',
  technical: 'Technical',
  'project-deep-dive': 'Project Deep Dive',
  'problem-solving': 'Problem Solving',
  behavioral: 'Behavioral',
  situational: 'Situational',
  hr: 'HR',
};

export function QuestionReviewCard({ index, result }: QuestionReviewCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {categoryLabels[result.category] || result.category}
        </span>
        {result.skipped && (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
            Skipped
          </span>
        )}
      </div>

      <h4 className="mb-1 text-sm font-semibold text-slate-500">Question</h4>
      <p className="mb-4 text-base font-medium text-slate-900">{result.question}</p>

      <h4 className="mb-1 text-sm font-semibold text-slate-500">Your Answer</h4>
      <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        {result.answer}
      </p>

      {!result.skipped && (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <PerformanceBar label="Relevance" score={result.evaluation.relevance} />
            <PerformanceBar label="Technical Accuracy" score={result.evaluation.technicalAccuracy} />
            <PerformanceBar label="Clarity" score={result.evaluation.clarity} />
            <PerformanceBar label="Specificity" score={result.evaluation.specificity} />
            <PerformanceBar label="Completeness" score={result.evaluation.completeness} />
          </div>

          <div className="mb-3 space-y-2">
            <h4 className="text-sm font-semibold text-slate-500">Evaluation</h4>
            {result.evaluation.strengths.length > 0 && (
              <div className="space-y-1">
                {result.evaluation.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm text-slate-700">{s}</p>
                  </div>
                ))}
              </div>
            )}
            {result.evaluation.missingPoints.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-slate-700">{m}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {result.skipped && (
        <div className="mb-3 flex items-start gap-2">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-slate-700">
            This question was skipped. Try to attempt every question, even when unsure.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Better Answer Structure</h4>
            <p className="mt-1 text-sm text-blue-800">{result.betterAnswerGuidance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
