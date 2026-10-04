export type ExperienceLevel = 'student' | 'fresher' | '0-2' | '2-5' | '5+';
export type InterviewType = 'technical' | 'hr' | 'mixed' | 'system-support' | 'software-engineering';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionCategory =
  | 'introduction'
  | 'resume'
  | 'technical'
  | 'project-deep-dive'
  | 'problem-solving'
  | 'behavioral'
  | 'situational'
  | 'hr';

export type Page = 'home' | 'setup' | 'analysis' | 'interview' | 'report';

export type MatchLevel = 'strong' | 'partial' | 'missing';

export interface SkillMatch {
  skill: string;
  level: MatchLevel;
}

export interface AnalysisResult {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  technologies: string[];
  experienceRequirements: string;
  keywords: string[];
  likelyInterviewAreas: string[];
  candidateSkills: string[];
  projects: string[];
  experience: string[];
  education: string[];
  candidateTechnologies: string[];
  strengths: string[];
  weakAreas: string[];
  claimsToQuestion: string[];
  skillMatches: SkillMatch[];
  focusAreas: string[];
  briefing: string;
}

export interface AnswerEvaluation {
  relevance: number;
  technicalAccuracy: number;
  clarity: number;
  specificity: number;
  completeness: number;
  strengths: string[];
  missingPoints: string[];
  followUpReason: string;
  quickFeedbackStrength: string;
  quickFeedbackImprovement: string;
}

export interface QuestionResult {
  question: string;
  category: QuestionCategory;
  answer: string;
  skipped: boolean;
  evaluation: AnswerEvaluation;
  betterAnswerGuidance: string;
}

export interface InterviewConfig {
  resume: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  interviewType: InterviewType;
  difficulty: Difficulty;
  numQuestions: number;
}

export interface InterviewState {
  config: InterviewConfig | null;
  analysis: AnalysisResult | null;
  questions: QuestionResult[];
  currentQuestionIndex: number;
  currentQuestionText: string;
  currentQuestionCategory: QuestionCategory;
  isComplete: boolean;
  askedQuestions: string[];
  performanceHistory: number[];
  usedSkills: string[];
  previousInterviewQuestions: string[];
}

export interface PerformanceBreakdown {
  technicalKnowledge: number;
  communication: number;
  relevance: number;
  problemSolving: number;
  projectKnowledge: number;
  answerCompleteness: number;
}

export interface FinalReport {
  practicePerformanceScore: number;
  breakdown: PerformanceBreakdown;
  strongAreas: string[];
  weakAreas: string[];
  questionReviews: QuestionResult[];
  preparationPlan: PreparationPlan;
  summary: string;
}

export interface PreparationPlanDay {
  day: number;
  title: string;
  items: string[];
}

export interface PreparationPlan {
  days: PreparationPlanDay[];
}
