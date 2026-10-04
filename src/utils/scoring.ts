import type { AnswerEvaluation, PerformanceBreakdown, QuestionResult } from '@/types';

export function clampScore(value: number): number {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

export function calculateOverallScore(evaluations: AnswerEvaluation[]): number {
  if (evaluations.length === 0) return 0;
  const total = evaluations.reduce((acc, e) => {
    return acc + (e.relevance + e.technicalAccuracy + e.clarity + e.specificity + e.completeness);
  }, 0);
  const maxPossible = evaluations.length * 50;
  return Math.round((total / maxPossible) * 100);
}

export function calculatePerformanceBreakdown(questions: QuestionResult[]): PerformanceBreakdown {
  if (questions.length === 0) {
    return {
      technicalKnowledge: 0,
      communication: 0,
      relevance: 0,
      problemSolving: 0,
      projectKnowledge: 0,
      answerCompleteness: 0,
    };
  }

  const validQuestions = questions.filter((q) => !q.skipped);
  const skippedCount = questions.length - validQuestions.length;

  const avg = (selector: (e: AnswerEvaluation) => number): number => {
    if (validQuestions.length === 0) return 0;
    const sum = validQuestions.reduce((acc, q) => acc + selector(q.evaluation), 0);
    return Math.round((sum / validQuestions.length) * 10) / 10;
  };

  const skipPenalty = (base: number): number => {
    if (questions.length === 0) return base;
    const penalty = (skippedCount / questions.length) * 2;
    return Math.max(0, Math.round((base - penalty) * 10) / 10);
  };

  return {
    technicalKnowledge: skipPenalty(avg((e) => e.technicalAccuracy)),
    communication: skipPenalty(avg((e) => e.clarity)),
    relevance: skipPenalty(avg((e) => e.relevance)),
    problemSolving: skipPenalty(avg((e) => (e.technicalAccuracy + e.completeness) / 2)),
    projectKnowledge: skipPenalty(avg((e) => (e.specificity + e.relevance) / 2)),
    answerCompleteness: skipPenalty(avg((e) => e.completeness)),
  };
}

export function scoreToPercentage(score: number): number {
  return Math.round((score / 10) * 100);
}

export function scoreLabel(score: number): string {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Needs Work';
  return 'Weak';
}

export function scoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-600';
  if (score >= 6) return 'text-blue-600';
  if (score >= 4) return 'text-amber-600';
  return 'text-red-600';
}

export function scoreBarColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500';
  if (score >= 6) return 'bg-blue-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}
