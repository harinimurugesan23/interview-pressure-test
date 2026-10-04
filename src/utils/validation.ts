import type { InterviewConfig, ExperienceLevel, InterviewType, Difficulty } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateInterviewConfig(config: Partial<InterviewConfig>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.resume || config.resume.trim().length < 50) {
    errors.push({
      field: 'resume',
      message: 'Please paste your resume. It should be at least 50 characters.',
    });
  }

  if (!config.jobDescription || config.jobDescription.trim().length < 50) {
    errors.push({
      field: 'jobDescription',
      message: 'Please paste the job description. It should be at least 50 characters.',
    });
  }

  if (!config.experienceLevel) {
    errors.push({ field: 'experienceLevel', message: 'Please select your experience level.' });
  }

  if (!config.interviewType) {
    errors.push({ field: 'interviewType', message: 'Please select an interview type.' });
  }

  if (!config.difficulty) {
    errors.push({ field: 'difficulty', message: 'Please select a difficulty level.' });
  }

  if (!config.numQuestions || ![5, 10, 15].includes(config.numQuestions)) {
    errors.push({ field: 'numQuestions', message: 'Please select the number of questions.' });
  }

  return errors;
}

export function validateAnswer(answer: string): { valid: boolean; message: string } {
  if (!answer || answer.trim().length === 0) {
    return { valid: false, message: 'Please type your answer before submitting.' };
  }
  if (answer.trim().length < 10) {
    return { valid: false, message: 'Your answer is very short. Try to elaborate at least a little.' };
  }
  return { valid: true, message: '' };
}

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'fresher', label: 'Fresher' },
  { value: '0-2', label: '0–2 years' },
  { value: '2-5', label: '2–5 years' },
  { value: '5+', label: '5+ years' },
];

export const INTERVIEW_TYPES: { value: InterviewType; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'system-support', label: 'System Support' },
  { value: 'software-engineering', label: 'Software Engineering' },
];

export const DIFFICULTY_LEVELS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const QUESTION_COUNTS = [5, 10, 15];
