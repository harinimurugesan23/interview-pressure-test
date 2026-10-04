import { useInterview } from '@/state/interviewState';
import { InterviewChat } from '@/components/InterviewChat';
import { RotateCcw } from 'lucide-react';

export function InterviewPage() {
  const { state, submitAnswer, startNew } = useInterview();

  if (!state.config || !state.analysis) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-600">Something went wrong. Please start a new interview.</p>
        <button
          onClick={startNew}
          className="mt-4 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  const lastResult = state.questions.length > 0 ? state.questions[state.questions.length - 1] : null;
  const lastFeedback = lastResult
    ? {
        strength: lastResult.evaluation.quickFeedbackStrength,
        improvement: lastResult.evaluation.quickFeedbackImprovement,
      }
    : null;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-sm font-semibold text-slate-900">Mock Interview in Progress</span>
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start New
          </button>
        </div>
      </div>

      <InterviewChat
        questionText={state.currentQuestionText}
        questionNumber={state.currentQuestionIndex + 1}
        totalQuestions={state.config.numQuestions}
        lastFeedback={lastFeedback}
        onSubmit={submitAnswer}
      />
    </div>
  );
}
