import type {
  AnalysisResult,
  InterviewConfig,
  QuestionResult,
  FinalReport,
  PerformanceBreakdown,
  PreparationPlan,
  PreparationPlanDay,
  AnswerEvaluation,
  QuestionCategory,
} from '@/types';
import { calculateOverallScore, calculatePerformanceBreakdown } from '@/utils/scoring';

function aggregateStrengths(questions: QuestionResult[]): string[] {
  const strengthCounts: Record<string, number> = {};

  for (const q of questions) {
    if (q.skipped) continue;
    for (const strength of q.evaluation.strengths) {
      strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
    }
  }

  const sorted = Object.entries(strengthCounts)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([strength]) => strength);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const s of sorted) {
    const key = s.toLowerCase().slice(0, 30);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
  }

  return unique.slice(0, 6);
}

function aggregateWeakAreas(questions: QuestionResult[], analysis: AnalysisResult): string[] {
  const weakCounts: Record<string, number> = {};

  for (const q of questions) {
    if (q.skipped) {
      weakCounts['Skipped questions instead of attempting'] = (weakCounts['Skipped questions instead of attempting'] || 0) + 1;
      continue;
    }
    for (const missing of q.evaluation.missingPoints) {
      weakCounts[missing] = (weakCounts[missing] || 0) + 1;
    }
  }

  const sorted = Object.entries(weakCounts)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([weak]) => weak);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const s of sorted) {
    const key = s.toLowerCase().slice(0, 30);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(s);
    }
  }

  const missingSkills = analysis.skillMatches
    .filter((sm) => sm.level === 'missing')
    .map((sm) => sm.skill);

  if (unique.length < 3 && missingSkills.length > 0) {
    unique.push(`Knowledge gaps in: ${missingSkills.slice(0, 3).join(', ')}`);
  }

  return unique.slice(0, 6);
}

function generateSummary(score: number, questions: QuestionResult[], analysis: AnalysisResult): string {
  const attempted = questions.filter((q) => !q.skipped).length;
  const skipped = questions.length - attempted;

  let summary = `You completed a ${questions.length}-question ${analysis.jobTitle} mock interview. `;

  if (score >= 75) {
    summary += `You performed strongly, demonstrating solid preparation and understanding of the key areas. `;
  } else if (score >= 50) {
    summary += `You showed a decent foundation but have clear areas to strengthen before a real interview. `;
  } else {
    summary += `This interview highlighted significant areas to work on before you\'re ready for the real thing. `;
  }

  if (skipped > 0) {
    summary += `You skipped ${skipped} question${skipped > 1 ? 's' : ''}, which impacted your overall score. `;
  }

  summary += `Use the detailed breakdown and preparation plan below to focus your study.`;

  return summary;
}

function generatePreparationPlan(
  questions: QuestionResult[],
  analysis: AnalysisResult,
  weakAreas: string[]
): PreparationPlan {
  const days: PreparationPlanDay[] = [];

  const technicalGaps: string[] = [];
  const projectGaps: string[] = [];
  const communicationGaps: string[] = [];
  const behavioralGaps: string[] = [];

  for (const q of questions) {
    if (q.skipped) continue;
    if (q.category === 'technical' || q.category === 'problem-solving') {
      if (q.evaluation.technicalAccuracy < 6) {
        technicalGaps.push(...q.evaluation.missingPoints.slice(0, 1));
      }
    }
    if (q.category === 'project-deep-dive') {
      if (q.evaluation.specificity < 6) {
        projectGaps.push(...q.evaluation.missingPoints.slice(0, 1));
      }
    }
    if (q.category === 'behavioral' || q.category === 'situational' || q.category === 'hr') {
      if (q.evaluation.clarity < 6 || q.evaluation.completeness < 6) {
        behavioralGaps.push(...q.evaluation.missingPoints.slice(0, 1));
      }
    }
    if (q.evaluation.clarity < 5) {
      communicationGaps.push('Practice structuring answers more clearly');
    }
  }

  const missingSkills = analysis.skillMatches
    .filter((sm) => sm.level === 'missing')
    .map((sm) => sm.skill);

  const day1Items: string[] = [];
  const focusSkills = analysis.requiredSkills.slice(0, 4);
  day1Items.push(...focusSkills.map((s) => `Review ${s} fundamentals and common interview questions`));
  if (missingSkills.length > 0) {
    day1Items.push(`Study gaps: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (technicalGaps.length > 0) {
    day1Items.push(`Practice: ${technicalGaps[0]}`);
  }
  day1Items.push('Practice 3-5 coding problems related to data structures and algorithms');
  day1Items.push('Review REST API design principles and HTTP methods');

  const day2Items: string[] = [];
  day2Items.push('For each project on your resume, prepare a 2-minute explanation covering:');
  day2Items.push('  - Architecture and technology choices (and why)');
  day2Items.push('  - Your specific contribution vs. the team\'s');
  day2Items.push('  - Challenges faced and how you solved them');
  day2Items.push('  - Database design decisions');
  day2Items.push('  - Testing and deployment approach');
  if (projectGaps.length > 0) {
    day2Items.push(`Focus on: ${projectGaps[0]}`);
  }
  day2Items.push('Prepare concrete examples with metrics (e.g., "reduced load time by 30%")');

  const day3Items: string[] = [];
  day3Items.push('Practice your 60-second self-introduction');
  day3Items.push('Prepare 3 behavioral stories using STAR structure (situation, task, action, result)');
  day3Items.push('Common behavioral topics: conflict, failure, tight deadline, learning new tech');
  if (behavioralGaps.length > 0) {
    day3Items.push(`Focus on: ${behavioralGaps[0]}`);
  }
  day3Items.push('Do a full mock interview (use "Practice Again" on this app)');
  day3Items.push('Review your weak areas and rehearse answers out loud');
  if (communicationGaps.length > 0) {
    day3Items.push('Practice speaking answers aloud — clarity and structure matter as much as content');
  }

  days.push({ day: 1, title: 'Technical Fundamentals', items: day1Items.slice(0, 6) });
  days.push({ day: 2, title: 'Project Deep Dive', items: day2Items.slice(0, 6) });
  days.push({ day: 3, title: 'Mock Interview & Behavioral Practice', items: day3Items.slice(0, 6) });

  return { days };
}

export function generateFinalReport(
  questions: QuestionResult[],
  analysis: AnalysisResult,
  config: InterviewConfig
): FinalReport {
  const evaluations = questions.map((q) => q.evaluation);
  const overallScore = calculateOverallScore(evaluations);
  const breakdown = calculatePerformanceBreakdown(questions);
  const strongAreas = aggregateStrengths(questions);
  const weakAreas = aggregateWeakAreas(questions, analysis);
  const summary = generateSummary(overallScore, questions, analysis);
  const preparationPlan = generatePreparationPlan(questions, analysis, weakAreas);

  return {
    practicePerformanceScore: overallScore,
    breakdown,
    strongAreas,
    weakAreas,
    questionReviews: questions,
    preparationPlan,
    summary,
  };
}
