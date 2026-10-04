import { useInterview } from '@/state/interviewState';
import { PerformanceBar } from '@/components/PerformanceBar';
import { QuestionReviewCard } from '@/components/QuestionReviewCard';
import { PreparationPlanSection } from '@/components/PreparationPlanSection';
import { scoreColor, scoreLabel } from '@/utils/scoring';
import { Award, TrendingUp, TrendingDown, RotateCcw, Sparkles, FileBarChart } from 'lucide-react';

export function ReportPage() {
  const { state, practiceAgain, startNew } = useInterview();
  const report = state.report;

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">No report available. Please complete an interview first.</p>
        <button
          onClick={startNew}
          className="mt-4 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  const score = report.practicePerformanceScore;
  const scoreColorClass =
    score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-blue-600' : 'text-amber-600';
  const scoreBg =
    score >= 75 ? 'bg-emerald-50 border-emerald-200' : score >= 50 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <FileBarChart className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Your Interview Report
        </h1>
        <p className="mt-2 text-base text-slate-600">{report.summary}</p>
      </div>

      {/* Overall Score */}
      <div className={`mb-8 rounded-2xl border p-6 text-center ${scoreBg}`}>
        <p className="text-sm font-medium text-slate-600">Practice Performance Score</p>
        <p className={`mt-2 text-5xl font-bold ${scoreColorClass}`}>{score}<span className="text-2xl">/100</span></p>
        <p className="mt-2 text-sm text-slate-500">
          {score >= 75 ? 'Strong performance — you\'re well prepared' : score >= 50 ? 'Decent foundation with room to grow' : 'Significant preparation needed'}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          This is a practice score and does not predict whether a company will hire you.
        </p>
      </div>

      {/* Performance Breakdown */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Performance Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <PerformanceBar label="Technical Knowledge" score={report.breakdown.technicalKnowledge} />
          <PerformanceBar label="Communication" score={report.breakdown.communication} />
          <PerformanceBar label="Relevance" score={report.breakdown.relevance} />
          <PerformanceBar label="Problem Solving" score={report.breakdown.problemSolving} />
          <PerformanceBar label="Project Knowledge" score={report.breakdown.projectKnowledge} />
          <PerformanceBar label="Answer Completeness" score={report.breakdown.answerCompleteness} />
        </div>
      </div>

      {/* Strong & Weak Areas */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-emerald-900">What you did well</h3>
          </div>
          <ul className="space-y-2">
            {report.strongAreas.length > 0 ? (
              report.strongAreas.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-emerald-700">Keep practicing to build your strengths.</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-semibold text-amber-900">Areas to improve</h3>
          </div>
          <ul className="space-y-2">
            {report.weakAreas.length > 0 ? (
              report.weakAreas.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {w}
                </li>
              ))
            ) : (
              <li className="text-sm text-amber-700">No major weak areas detected. Great job!</li>
            )}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Question-by-Question Review</h3>
        <div className="space-y-4">
          {report.questionReviews.map((result, i) => (
            <QuestionReviewCard key={i} index={i} result={result} />
          ))}
        </div>
      </div>

      {/* Preparation Plan */}
      <div className="mb-8">
        <PreparationPlanSection plan={report.preparationPlan} />
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
        <h3 className="text-xl font-bold text-slate-900">Ready for another round?</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Your first interview showed you where you stand. Your next one can show you how much
          you've improved.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={practiceAgain}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            Practice Again
          </button>
          <button
            onClick={startNew}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
