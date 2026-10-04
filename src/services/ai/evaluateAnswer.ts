import type { AnswerEvaluation, AnalysisResult, InterviewConfig, QuestionCategory } from '@/types';

const VAGUE_INDICATORS = [
  'stuff', 'things', 'etc', 'something', 'whatever', 'basically', 'kind of',
  'sort of', 'i think', 'maybe', 'probably', 'i guess', 'not sure',
];

const CONFIDENT_INDICATORS = [
  'i implemented', 'i designed', 'i built', 'i created', 'i developed',
  'i optimized', 'i solved', 'i led', 'i managed', 'i achieved',
  'specifically', 'exactly', 'in particular', 'for example',
];

const TECHNICAL_KEYWORDS = [
  'api', 'database', 'sql', 'java', 'react', 'python', 'javascript', 'node',
  'docker', 'aws', 'rest', 'http', 'json', 'authentication', 'algorithm',
  'data structure', 'oop', 'class', 'object', 'method', 'function',
  'array', 'hash', 'tree', 'graph', 'cache', 'queue', 'stack',
  'microservice', 'deployment', 'ci/cd', 'testing', 'unit test',
  'spring', 'hibernate', 'jwt', 'token', 'session', 'cookie',
];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function hasVagueLanguage(answer: string): boolean {
  const lower = answer.toLowerCase();
  return VAGUE_INDICATORS.some((indicator) => lower.includes(indicator));
}

function hasConfidentLanguage(answer: string): boolean {
  const lower = answer.toLowerCase();
  return CONFIDENT_INDICATORS.some((indicator) => lower.includes(indicator));
}

function countTechnicalTerms(answer: string): number {
  const lower = answer.toLowerCase();
  let count = 0;
  for (const term of TECHNICAL_KEYWORDS) {
    if (lower.includes(term)) count++;
  }
  return count;
}

function countSpecificDetails(answer: string): number {
  let count = 0;
  if (/\d+%/.test(answer)) count++;
  if (/\d+\s*(days?|weeks?|months?|years?|hours?)/i.test(answer)) count++;
  if (/(first|then|after that|finally|next|step)/i.test(answer)) count++;
  if (/(because|so that|in order to|due to|as a result)/i.test(answer)) count++;
  if (/(for example|for instance|such as|like when)/i.test(answer)) count++;
  return count;
}

function extractAnswerSkills(answer: string, analysis: AnalysisResult): string[] {
  const lower = answer.toLowerCase();
  return analysis.candidateSkills.filter((skill) => lower.includes(skill.toLowerCase()));
}

function isAnswerRelevant(answer: string, question: string, analysis: AnalysisResult): number {
  const answerLower = answer.toLowerCase();
  const questionLower = question.toLowerCase();
  let score = 5;

  const questionWords = questionLower.split(/\s+/).filter((w) => w.length > 4 && !['about', 'would', 'could', 'please', 'explain', 'describe', 'tell'].includes(w));
  let matchedWords = 0;
  for (const word of questionWords) {
    if (answerLower.includes(word)) matchedWords++;
  }

  const matchRatio = questionWords.length > 0 ? matchedWords / questionWords.length : 0;
  if (matchRatio > 0.3) score += 2;
  else if (matchRatio > 0.15) score += 1;
  else score -= 2;

  const answerSkills = extractAnswerSkills(answer, analysis);
  if (answerSkills.length > 0) score += 1;

  if (answerLower.includes('i don\'t know') || answerLower.includes('not sure') || answerLower.includes('no idea')) {
    score = Math.min(score, 3);
  }

  return Math.max(1, Math.min(10, score));
}

function evaluateTechnicalAccuracy(
  answer: string,
  question: string,
  category: QuestionCategory,
  analysis: AnalysisResult
): number {
  if (category !== 'technical' && category !== 'project-deep-dive' && category !== 'problem-solving') {
    return 7;
  }

  let score = 5;
  const techCount = countTechnicalTerms(answer);

  if (techCount >= 5) score += 3;
  else if (techCount >= 3) score += 2;
  else if (techCount >= 1) score += 1;
  else score -= 1;

  if (/(correct|accurate|properly|efficiently|optimize)/i.test(answer)) score += 1;
  if (/(wrong|incorrect|mistake|error|failed)/i.test(answer) && !/(learned|fixed|resolved|improved)/i.test(answer)) score -= 1;

  const answerSkills = extractAnswerSkills(answer, analysis);
  if (answerSkills.length >= 2) score += 1;

  if (hasVagueLanguage(answer)) score -= 1;

  return Math.max(1, Math.min(10, score));
}

function evaluateClarity(answer: string): number {
  let score = 5;
  const wordCount = countWords(answer);

  if (wordCount < 15) score -= 2;
  else if (wordCount < 30) score -= 1;
  else if (wordCount > 50 && wordCount < 200) score += 1;
  else if (wordCount > 300) score -= 1;

  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3 && sentences.length <= 10) score += 2;
  else if (sentences.length >= 2) score += 1;
  else if (sentences.length <= 1 && wordCount > 20) score -= 1;

  if (/(first|second|third|finally|in conclusion|to summarize)/i.test(answer)) score += 1;
  if (hasVagueLanguage(answer)) score -= 1;
  if (hasConfidentLanguage(answer)) score += 1;

  return Math.max(1, Math.min(10, score));
}

function evaluateSpecificity(answer: string): number {
  let score = 5;
  const detailCount = countSpecificDetails(answer);

  if (detailCount >= 4) score += 3;
  else if (detailCount >= 2) score += 2;
  else if (detailCount >= 1) score += 1;
  else score -= 1;

  if (/\d+/.test(answer)) score += 1;
  if (/(i|my|we|our)/i.test(answer) && /(did|built|created|implemented|designed|solved)/i.test(answer)) score += 1;

  if (hasVagueLanguage(answer)) score -= 2;

  return Math.max(1, Math.min(10, score));
}

function evaluateCompleteness(answer: string, question: string): number {
  let score = 5;
  const wordCount = countWords(answer);

  if (wordCount >= 100) score += 3;
  else if (wordCount >= 60) score += 2;
  else if (wordCount >= 30) score += 1;
  else if (wordCount < 15) score -= 2;

  const questionParts = question.split(/[,;?]/).filter((p) => p.trim().length > 5);
  const answerLower = answer.toLowerCase();
  let addressedParts = 0;
  for (const part of questionParts) {
    const keyWords = part.trim().toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    const matched = keyWords.some((w) => answerLower.includes(w));
    if (matched) addressedParts++;
  }

  if (questionParts.length > 1) {
    if (addressedParts >= questionParts.length * 0.7) score += 2;
    else if (addressedParts >= questionParts.length * 0.5) score += 1;
    else score -= 1;
  }

  return Math.max(1, Math.min(10, score));
}

function identifyStrengths(
  answer: string,
  evaluation: Omit<AnswerEvaluation, 'strengths' | 'missingPoints' | 'followUpReason' | 'quickFeedbackStrength' | 'quickFeedbackImprovement'>,
  category: QuestionCategory,
  analysis: AnalysisResult
): string[] {
  const strengths: string[] = [];

  if (evaluation.clarity >= 7) strengths.push('Clear and well-structured response');
  if (evaluation.specificity >= 7) strengths.push('Provided specific examples and details');
  if (evaluation.technicalAccuracy >= 7 && (category === 'technical' || category === 'project-deep-dive')) {
    strengths.push('Demonstrated solid technical understanding');
  }
  if (evaluation.relevance >= 7) strengths.push('Answer was directly relevant to the question');
  if (evaluation.completeness >= 7) strengths.push('Thorough and complete answer');
  if (hasConfidentLanguage(answer)) strengths.push('Confident, ownership-oriented language');

  const answerSkills = extractAnswerSkills(answer, analysis);
  if (answerSkills.length >= 2) strengths.push(`Connected answer to ${answerSkills.slice(0, 2).join(' and ')} experience`);

  if (strengths.length === 0) strengths.push('Attempted to address the question');
  return strengths.slice(0, 4);
}

function identifyMissingPoints(
  answer: string,
  evaluation: Omit<AnswerEvaluation, 'strengths' | 'missingPoints' | 'followUpReason' | 'quickFeedbackStrength' | 'quickFeedbackImprovement'>,
  category: QuestionCategory,
  analysis: AnalysisResult
): string[] {
  const missing: string[] = [];

  if (evaluation.specificity < 5) missing.push('Lacked specific examples or details');
  if (evaluation.completeness < 5) missing.push('Answer felt incomplete — could have elaborated more');
  if (evaluation.technicalAccuracy < 5 && (category === 'technical' || category === 'project-deep-dive')) {
    missing.push('Technical accuracy could be stronger');
  }
  if (evaluation.relevance < 5) missing.push('Response drifted from the actual question');
  if (evaluation.clarity < 5) missing.push('Answer could be more clearly structured');
  if (hasVagueLanguage(answer)) missing.push('Used vague language — be more specific');
  if (countWords(answer) < 30) missing.push('Answer was too brief');

  if (missing.length === 0) missing.push('Minor: consider adding more depth or context');
  return missing.slice(0, 4);
}

function generateFollowUpReason(
  answer: string,
  evaluation: Omit<AnswerEvaluation, 'strengths' | 'missingPoints' | 'followUpReason' | 'quickFeedbackStrength' | 'quickFeedbackImprovement'>,
  category: QuestionCategory,
  analysis: AnalysisResult
): string {
  if (evaluation.specificity < 4) {
    const skills = extractAnswerSkills(answer, analysis);
    if (skills.length > 0) {
      return `You mentioned ${skills[0]}. Can you give me a specific example of how you used it — perhaps a particular challenge you faced and how you resolved it?`;
    }
    return 'Can you give me a specific example from your experience to illustrate that?';
  }

  if (evaluation.technicalAccuracy < 4 && (category === 'technical' || category === 'project-deep-dive')) {
    return 'Let me ask a more fundamental question: can you explain the basic concept behind this in your own words?';
  }

  if (evaluation.completeness < 4) {
    return 'I think there\'s more to this. Can you walk me through the rest of your thinking?';
  }

  if (evaluation.relevance < 4) {
    return 'Let me refocus — I was specifically asking about this aspect. Can you address that directly?';
  }

  const answerSkills = extractAnswerSkills(answer, analysis);
  if (answerSkills.length > 0 && evaluation.specificity >= 6) {
    return `You brought up ${answerSkills[0]}. Why did you choose that over alternatives, and what trade-offs did you consider?`;
  }

  return '';
}

function generateQuickFeedback(
  strengths: string[],
  missingPoints: string[]
): { strength: string; improvement: string } {
  const strength = strengths[0] || 'You attempted the question';
  const improvement = missingPoints[0] || 'Try to add more detail next time';
  return { strength, improvement };
}

function generateBetterAnswerGuidance(
  question: string,
  answer: string,
  category: QuestionCategory,
  evaluation: AnswerEvaluation
): string {
  if (category === 'behavioral' || category === 'situational' || category === 'hr') {
    return 'For behavioral questions, use the STAR method: describe the Situation, the Task you faced, the Action you took, and the Result. This gives your answer a clear narrative arc and makes it easy for the interviewer to follow. Start with a brief context, then focus mostly on your specific actions and the measurable outcome.';
  }

  if (category === 'technical') {
    if (evaluation.technicalAccuracy < 5) {
      return 'For technical questions, start by stating the core concept clearly, then provide a concrete example. If you\'re unsure, it\'s better to say "I\'m not 100% certain, but based on my understanding..." and reason through it rather than guessing. Interviewers value honest reasoning over confident wrong answers.';
    }
    return 'A strong technical answer follows this structure: 1) Define the concept, 2) Explain how it works, 3) Give a real example from your experience, 4) Mention trade-offs or alternatives. This shows both knowledge and practical understanding.';
  }

  if (category === 'project-deep-dive') {
    return 'When discussing projects, structure your answer around: what the project did, your specific role, the technical decisions you made (and why), challenges you faced, and what you\'d do differently. Focus on YOUR contribution, not just what the team did.';
  }

  if (category === 'introduction') {
    return 'For self-introductions, keep it to 60-90 seconds. Start with a brief summary of who you are, highlight 1-2 relevant experiences, mention a key project, and connect it to why you\'re interested in this role. Avoid reciting your entire resume.';
  }

  if (category === 'problem-solving') {
    return 'For problem-solving questions, walk through your thought process out loud: clarify the problem, identify key constraints, describe your approach step by step, discuss trade-offs, and summarize your solution. Interviewers want to see how you think, not just the final answer.';
  }

  return 'Structure your answer with a clear beginning (context), middle (your specific actions/decisions), and end (results or takeaways). Be specific and use examples.';
}

export function evaluateAnswer(
  answer: string,
  question: string,
  category: QuestionCategory,
  analysis: AnalysisResult,
  config: InterviewConfig,
  skipped: boolean = false
): AnswerEvaluation {
  if (skipped) {
    return {
      relevance: 1,
      technicalAccuracy: 1,
      clarity: 1,
      specificity: 1,
      completeness: 1,
      strengths: [],
      missingPoints: ['Question was skipped — no answer provided'],
      followUpReason: '',
      quickFeedbackStrength: 'You chose to skip rather than guess',
      quickFeedbackImprovement: 'Try to attempt every question, even if you\'re unsure',
    };
  }

  const relevance = isAnswerRelevant(answer, question, analysis);
  const technicalAccuracy = evaluateTechnicalAccuracy(answer, question, category, analysis);
  const clarity = evaluateClarity(answer);
  const specificity = evaluateSpecificity(answer);
  const completeness = evaluateCompleteness(answer, question);

  const baseEval = { relevance, technicalAccuracy, clarity, specificity, completeness };

  const strengths = identifyStrengths(answer, baseEval, category, analysis);
  const missingPoints = identifyMissingPoints(answer, baseEval, category, analysis);
  const followUpReason = generateFollowUpReason(answer, baseEval, category, analysis);
  const quickFeedback = generateQuickFeedback(strengths, missingPoints);

  return {
    relevance,
    technicalAccuracy,
    clarity,
    specificity,
    completeness,
    strengths,
    missingPoints,
    followUpReason,
    quickFeedbackStrength: quickFeedback.strength,
    quickFeedbackImprovement: quickFeedback.improvement,
  };
}

export function generateBetterAnswerGuidanceForQuestion(
  question: string,
  answer: string,
  category: QuestionCategory,
  evaluation: AnswerEvaluation
): string {
  return generateBetterAnswerGuidance(question, answer, category, evaluation);
}
