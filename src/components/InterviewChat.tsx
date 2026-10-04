import { useState, useRef, useEffect } from 'react';
import { Send, SkipForward, AlertCircle } from 'lucide-react';
import { validateAnswer } from '@/utils/validation';
import { FeedbackCard } from './FeedbackCard';
import { ProgressBar } from './ProgressBar';

interface InterviewChatProps {
  questionText: string;
  questionNumber: number;
  totalQuestions: number;
  lastFeedback: { strength: string; improvement: string } | null;
  onSubmit: (answer: string, skipped: boolean) => void;
}

export function InterviewChat({
  questionText,
  questionNumber,
  totalQuestions,
  lastFeedback,
  onSubmit,
}: InterviewChatProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAnswer('');
    setError(null);
    setShowFeedback(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [questionNumber]);

  useEffect(() => {
    if (lastFeedback) {
      setShowFeedback(true);
    }
  }, [lastFeedback, questionNumber]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateAnswer(answer);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setError(null);
    onSubmit(answer, false);
  }

  function handleSkip() {
    setError(null);
    onSubmit('', true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      {showFeedback && lastFeedback && (
        <div className="mt-4">
          <FeedbackCard
            strength={lastFeedback.strength}
            improvement={lastFeedback.improvement}
          />
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">AI Interviewer</span>
        </div>
        <p className="text-lg leading-relaxed text-slate-800">{questionText}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="answer" className="mb-2 block text-sm font-semibold text-slate-900">
          Your Answer
        </label>
        <textarea
          id="answer"
          ref={textareaRef}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Type your answer here. Be specific and use examples from your experience..."
          rows={6}
          aria-required="true"
          className={`w-full resize-y rounded-xl border p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-slate-300 focus:ring-slate-400'
          }`}
        />
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <p className="mt-1.5 text-xs text-slate-400">{answer.length} characters</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <Send className="h-4 w-4" />
            Submit Answer
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
