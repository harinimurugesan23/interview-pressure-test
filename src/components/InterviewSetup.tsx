import { useState } from 'react';
import type { ExperienceLevel, InterviewType, Difficulty } from '@/types';
import {
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
  DIFFICULTY_LEVELS,
  QUESTION_COUNTS,
  validateInterviewConfig,
  type ValidationError,
} from '@/utils/validation';
import { DEMO_CONFIG } from '@/data/demoData';
import { Shield, FileText, Briefcase, Zap, Hash, Upload, Sparkles } from 'lucide-react';

interface InterviewSetupProps {
  onStart: (config: {
    resume: string;
    jobDescription: string;
    experienceLevel: ExperienceLevel;
    interviewType: InterviewType;
    difficulty: Difficulty;
    numQuestions: number;
  }) => void;
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('fresher');
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function loadDemo() {
    setResume(DEMO_CONFIG.resume);
    setJobDescription(DEMO_CONFIG.jobDescription);
    setExperienceLevel(DEMO_CONFIG.experienceLevel);
    setInterviewType(DEMO_CONFIG.interviewType);
    setDifficulty(DEMO_CONFIG.difficulty);
    setNumQuestions(DEMO_CONFIG.numQuestions);
    setErrors([]);
    setTouched({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const config = { resume, jobDescription, experienceLevel, interviewType, difficulty, numQuestions };
    const validationErrors = validateInterviewConfig(config);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      const touchedMap: Record<string, boolean> = {};
      validationErrors.forEach((err) => (touchedMap[err.field] = true));
      setTouched(touchedMap);
      return;
    }
    setErrors([]);
    onStart(config);
  }

  function getFieldError(field: string): string | null {
    const err = errors.find((e) => e.field === field);
    return err ? err.message : null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Set Up Your Interview
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Paste your resume and the job description. The AI will analyze both and tailor the interview.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <button
          type="button"
          onClick={loadDemo}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          Load Demo Data (Software Engineer)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <label htmlFor="resume" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-slate-600" />
            Resume
            <span className="text-red-500">*</span>
          </label>
          <p className="mb-3 text-xs text-slate-500">
            Paste your resume as text. This is used only for this session and is not stored.
          </p>
          <textarea
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here..."
            rows={8}
            aria-required="true"
            aria-invalid={!!getFieldError('resume')}
            className={`w-full resize-y rounded-lg border p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
              getFieldError('resume')
                ? 'border-red-300 focus:ring-red-400'
                : 'border-slate-300 focus:ring-slate-400'
            }`}
          />
          {getFieldError('resume') && (
            <p className="mt-1.5 text-sm text-red-600">{getFieldError('resume')}</p>
          )}
          <p className="mt-1.5 text-xs text-slate-400">{resume.length} characters</p>
        </div>

        {/* Job Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <label htmlFor="jobDescription" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Briefcase className="h-4 w-4 text-slate-600" />
            Job Description
            <span className="text-red-500">*</span>
          </label>
          <p className="mb-3 text-xs text-slate-500">
            Paste the job description you want to practice for.
          </p>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            aria-required="true"
            aria-invalid={!!getFieldError('jobDescription')}
            className={`w-full resize-y rounded-lg border p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
              getFieldError('jobDescription')
                ? 'border-red-300 focus:ring-red-400'
                : 'border-slate-300 focus:ring-slate-400'
            }`}
          />
          {getFieldError('jobDescription') && (
            <p className="mt-1.5 text-sm text-red-600">{getFieldError('jobDescription')}</p>
          )}
          <p className="mt-1.5 text-xs text-slate-400">{jobDescription.length} characters</p>
        </div>

        {/* Options Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Experience Level */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Zap className="h-4 w-4 text-slate-600" />
              Experience Level
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExperienceLevel(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    experienceLevel === opt.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Briefcase className="h-4 w-4 text-slate-600" />
              Interview Type
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERVIEW_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setInterviewType(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    interviewType === opt.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Zap className="h-4 w-4 text-slate-600" />
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_LEVELS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    difficulty === opt.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Hash className="h-4 w-4 text-slate-600" />
              Number of Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNTS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNumQuestions(opt)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    numQuestions === opt
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
          <p className="text-sm text-slate-600">
            Your resume and interview responses are used for this session only and are not
            permanently stored by this app. No data is sent to any external server.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <Upload className="h-5 w-5" />
          Analyze &amp; Start Interview
        </button>
      </form>
    </div>
  );
}
