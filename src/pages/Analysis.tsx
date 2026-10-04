import { useInterview } from '@/state/interviewState';
import { SkillMatchBadge } from '@/components/SkillMatchBadge';
import { Briefcase, FileText, Target, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function AnalysisPage() {
  const { state, enterInterview } = useInterview();
  const analysis = state.analysis;

  if (!analysis) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">Analysis failed. Please go back and try again.</p>
      </div>
    );
  }

  const strong = analysis.skillMatches.filter((s) => s.level === 'strong');
  const partial = analysis.skillMatches.filter((s) => s.level === 'partial');
  const missing = analysis.skillMatches.filter((s) => s.level === 'missing');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <Target className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interview Briefing</h1>
        <p className="mt-2 text-base text-slate-600">
          Here's what the AI found after analyzing your resume and the job description.
        </p>
      </div>

      {/* Job Title */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Briefcase className="h-4 w-4" />
          Target Role
        </div>
        <p className="mt-1 text-xl font-bold text-slate-900">{analysis.jobTitle}</p>
      </div>

      {/* Briefing */}
      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-base leading-relaxed text-slate-800">{analysis.briefing}</p>
      </div>

      {/* Focus Areas */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Your interview will focus on:</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.focusAreas.map((area, i) => (
            <span
              key={i}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Matches */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Skill Match Analysis</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.skillMatches.map((match, i) => (
            <SkillMatchBadge key={i} match={match} />
          ))}
        </div>
      </div>

      {/* Strengths & Weak Areas */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-emerald-900">Your Strengths</h3>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-900">Areas to Watch</h3>
          </div>
          <ul className="space-y-2">
            {analysis.weakAreas.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Claims to Question */}
      {analysis.claimsToQuestion.length > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Claims the interviewer may probe
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.claimsToQuestion.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Likely Interview Areas */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Likely Interview Areas</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.likelyInterviewAreas.map((area, i) => (
            <span
              key={i}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={enterInterview}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        Enter Interview
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
