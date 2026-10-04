import type {
  AnalysisResult,
  InterviewConfig,
  QuestionCategory,
  AnswerEvaluation,
  QuestionResult,
  InterviewType,
  Difficulty,
  ExperienceLevel,
} from '@/types';

interface QuestionTemplate {
  category: QuestionCategory;
  text: string;
  difficulty: Difficulty;
}

const CATEGORY_DISTRIBUTION: Record<InterviewType, QuestionCategory[]> = {
  technical: ['technical', 'technical', 'technical', 'project-deep-dive', 'problem-solving', 'resume', 'technical', 'problem-solving', 'technical', 'behavioral', 'technical', 'project-deep-dive', 'situational', 'technical', 'problem-solving'],
  hr: ['introduction', 'hr', 'hr', 'behavioral', 'situational', 'hr', 'behavioral', 'hr', 'situational', 'hr', 'behavioral', 'hr', 'situational', 'behavioral', 'hr'],
  mixed: ['introduction', 'resume', 'technical', 'project-deep-dive', 'behavioral', 'technical', 'problem-solving', 'hr', 'situational', 'technical', 'project-deep-dive', 'behavioral', 'technical', 'hr', 'problem-solving'],
  'system-support': ['introduction', 'technical', 'situational', 'technical', 'problem-solving', 'technical', 'situational', 'resume', 'technical', 'behavioral', 'situational', 'technical', 'problem-solving', 'technical', 'behavioral'],
  'software-engineering': ['introduction', 'technical', 'project-deep-dive', 'technical', 'problem-solving', 'project-deep-dive', 'technical', 'problem-solving', 'technical', 'behavioral', 'project-deep-dive', 'technical', 'problem-solving', 'situational', 'technical'],
};

const OPENING_QUESTIONS = [
  'Hi, thanks for joining today. Could you start by introducing yourself and walking me through your background as it relates to this role?',
  'Welcome. Let\'s begin — can you briefly tell me about yourself and what interests you about this position?',
  'Thanks for being here. To start, could you introduce yourself and highlight the experience most relevant to this role?',
];

const TECHNICAL_QUESTIONS: Record<Difficulty, string[]> = {
  easy: [
    'Can you explain what a REST API is and how it differs from other API styles?',
    'What is the difference between SQL and NoSQL databases? When would you use each?',
    'Explain the concept of object-oriented programming. What are its four main pillars?',
    'What is HTTP and what are the common HTTP methods you\'ve used?',
    'Can you explain what normalization means in the context of databases?',
    'What is the difference between a stack and a queue? Give a real-world analogy.',
    'Explain what Git is and describe a basic Git workflow you\'ve used.',
    'What is a primary key in a database, and why is it important?',
    'Can you explain what a foreign key is and how it relates to a primary key?',
    'What is the difference between == and === in JavaScript?',
  ],
  medium: [
    'How would you design a REST API for a simple e-commerce system? Walk me through the endpoints you\'d create.',
    'Explain the difference between SQL JOIN types — INNER, LEFT, RIGHT, and FULL OUTER JOIN. When would you use each?',
    'How does JWT authentication work? Walk me through the flow from login to authenticated request.',
    'What are the SOLID principles? Can you give an example of applying one of them?',
    'How would you handle concurrency issues in a database? Explain with an example.',
    'Describe how you would design a rate limiter for a REST API. What factors would you consider?',
    'What is the difference between authentication and authorization? How do you implement both?',
    'Explain how garbage collection works in Java. What are the different types of garbage collectors?',
    'How would you optimize a slow SQL query? What steps would you take?',
    'What is connection pooling and why is it important for backend applications?',
  ],
  hard: [
    'Design a URL shortening service like bit.ly. How would you handle scaling to millions of requests?',
    'How would you design a distributed caching system? What consistency guarantees would you provide?',
    'Explain how you would handle database sharding for a high-traffic application. What trade-offs are involved?',
    'Design a system to handle real-time notifications for millions of users. What technologies would you use?',
    'How would you implement an eventually consistent system across multiple data centers?',
    'Walk me through how you would design a message queue system from scratch.',
    'How would you handle a situation where your REST API is receiving 10x the normal traffic suddenly?',
    'Design a system for distributed transaction handling. How do you ensure ACID properties across services?',
    'Explain how you would implement a circuit breaker pattern in a microservices architecture.',
    'How would you design a system that needs to process 1 million events per second with low latency?',
  ],
};

const PROJECT_QUESTIONS = [
  'Let\'s talk about your {project}. Can you walk me through the architecture and your specific contribution?',
  'In your {project}, what was the most challenging technical problem you faced, and how did you solve it?',
  'Why did you choose {tech} for your {project}? What alternatives did you consider?',
  'How did you handle data modeling in your {project}? Can you describe your schema or collection design?',
  'In your {project}, how did you handle testing? What was your testing strategy?',
  'If you had to rebuild your {project} from scratch today, what would you do differently and why?',
  'How did you deploy your {project}? Walk me through your deployment process.',
  'In your {project}, how did you handle errors and edge cases? Give me a specific example.',
];

const BEHAVIORAL_QUESTIONS = [
  'Tell me about a time you faced a conflict with a teammate. How did you resolve it?',
  'Describe a situation where you had to learn a new technology quickly. How did you approach it?',
  'Tell me about a project that didn\'t go as planned. What happened and what did you learn?',
  'Describe a time when you had to work under a tight deadline. How did you manage your time?',
  'Tell me about a time you received critical feedback. How did you respond to it?',
  'Describe a situation where you took initiative beyond your assigned responsibilities.',
  'Tell me about a time you failed at something. What did you learn from it?',
  'Describe a situation where you had to explain a technical concept to a non-technical person.',
];

const SITUATIONAL_QUESTIONS = [
  'What would you do if you joined a team and found their codebase had no tests and no documentation?',
  'If you discovered a critical bug in production, what steps would you take?',
  'How would you handle a situation where your manager asks you to deliver a feature in an unrealistic timeframe?',
  'What would you do if you disagreed with a senior engineer\'s technical decision?',
  'If you had to choose between delivering on time with technical debt or delaying for cleaner code, how would you decide?',
  'How would you handle a situation where a production deployment goes wrong?',
  'What would you do if you realized a requirement you\'ve been working on for weeks is no longer needed?',
];

const HR_QUESTIONS = [
  'Where do you see yourself in the next 3 years, and how does this role fit into that plan?',
  'What are your greatest strengths, and how do they apply to this role?',
  'What is an area you\'re actively working to improve?',
  'Why are you interested in this particular role and our company?',
  'What motivates you in your work?',
  'How do you handle pressure and stressful situations?',
  'What are your salary expectations? How did you arrive at that number?',
  'Do you have any questions for me about the role or the company?',
];

const RESUME_QUESTIONS = [
  'I see you have experience with {skill}. Can you tell me about a specific project where you used it?',
  'Your resume mentions {project}. What was your exact role and contribution in that project?',
  'I notice you\'ve worked with {skill}. Can you explain a challenging problem you solved using it?',
  'Tell me more about your experience at {experience}. What was the most impactful thing you did there?',
  'Your resume lists {skill} — how deep is your knowledge? Can you describe a complex scenario where you applied it?',
];

const PROBLEM_SOLVING_QUESTIONS = [
  'How would you approach debugging a performance issue in a web application that loads slowly?',
  'If you had to design a system to detect duplicate records in a large dataset, how would you approach it?',
  'Walk me through how you would troubleshoot a REST API that\'s returning 500 errors intermittently.',
  'How would you approach optimizing a database that\'s become slow as the data has grown?',
  'If you needed to migrate a monolithic application to microservices, how would you plan it?',
  'How would you design a system to handle file uploads of up to 10GB?',
];

function pickRandom<T>(arr: T[], exclude: Set<string>): T | null {
  const available = arr.filter((item) => !exclude.has(String(item)));
  if (available.length === 0) return arr[Math.floor(Math.random() * arr.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function extractProjectName(projectStr: string): string {
  const name = projectStr.split('(')[0].split('-')[0].split(':')[0].trim();
  if (name.length > 50) return name.slice(0, 50) + '...';
  return name || 'your project';
}

function extractTechFromProject(projectStr: string): string {
  const techKeywords = ['React', 'Spring Boot', 'Node.js', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'JWT', 'WebSocket', 'Java', 'Python', 'SQL'];
  const lower = projectStr.toLowerCase();
  for (const tech of techKeywords) {
    if (lower.includes(tech.toLowerCase())) return tech;
  }
  return 'the technologies you chose';
}

function generateQuestionForCategory(
  category: QuestionCategory,
  analysis: AnalysisResult,
  config: InterviewConfig,
  askedQuestions: string[],
  previousEvaluation: AnswerEvaluation | null,
  questionIndex: number
): string {
  const askedSet = new Set(askedQuestions.map((q) => q.toLowerCase().slice(0, 60)));

  if (category === 'introduction') {
    return pickRandom(OPENING_QUESTIONS, askedSet) || OPENING_QUESTIONS[0];
  }

  if (category === 'technical') {
    const questions = TECHNICAL_QUESTIONS[config.difficulty];
    const skillSpecific = analysis.requiredSkills.slice(0, 5);
    if (skillSpecific.length > 0 && Math.random() > 0.3) {
      const skill = pickRandom(skillSpecific, new Set()) || skillSpecific[0];
      const tailored = `Let\'s talk about ${skill}. ${questions[Math.floor(Math.random() * Math.min(3, questions.length))]}`;
      if (!askedSet.has(tailored.toLowerCase().slice(0, 60))) return tailored;
    }
    return pickRandom(questions, askedSet) || questions[0];
  }

  if (category === 'project-deep-dive') {
    if (analysis.projects.length > 0) {
      const project = analysis.projects[Math.floor(Math.random() * Math.min(3, analysis.projects.length))];
      const projName = extractProjectName(project);
      const tech = extractTechFromProject(project);
      const template = pickRandom(PROJECT_QUESTIONS, askedSet) || PROJECT_QUESTIONS[0];
      return template.replace('{project}', projName).replace('{tech}', tech);
    }
    return 'Tell me about a project you\'re particularly proud of. What was your role and what did you learn?';
  }

  if (category === 'behavioral') {
    return pickRandom(BEHAVIORAL_QUESTIONS, askedSet) || BEHAVIORAL_QUESTIONS[0];
  }

  if (category === 'situational') {
    return pickRandom(SITUATIONAL_QUESTIONS, askedSet) || SITUATIONAL_QUESTIONS[0];
  }

  if (category === 'hr') {
    return pickRandom(HR_QUESTIONS, askedSet) || HR_QUESTIONS[0];
  }

  if (category === 'resume') {
    if (analysis.candidateSkills.length > 0 && analysis.projects.length > 0) {
      const useSkill = Math.random() > 0.5;
      if (useSkill) {
        const skill = analysis.candidateSkills[Math.floor(Math.random() * Math.min(5, analysis.candidateSkills.length))];
        const template = pickRandom(RESUME_QUESTIONS, askedSet) || RESUME_QUESTIONS[0];
        return template.replace('{skill}', skill).replace('{project}', analysis.projects[0] ? extractProjectName(analysis.projects[0]) : 'your project').replace('{experience}', analysis.experience[0] || 'your previous role');
      } else {
        const project = analysis.projects[Math.floor(Math.random() * Math.min(3, analysis.projects.length))];
        const template = RESUME_QUESTIONS[1];
        return template.replace('{project}', extractProjectName(project));
      }
    }
    return 'Can you walk me through your most relevant experience and how it prepares you for this role?';
  }

  if (category === 'problem-solving') {
    return pickRandom(PROBLEM_SOLVING_QUESTIONS, askedSet) || PROBLEM_SOLVING_QUESTIONS[0];
  }

  return 'Can you tell me more about your experience and how it relates to this role?';
}

export function generateOpeningQuestion(analysis: AnalysisResult, config: InterviewConfig): { text: string; category: QuestionCategory } {
  const text = generateQuestionForCategory('introduction', analysis, config, [], null, 0);
  return { text, category: 'introduction' };
}

export function generateQuestionList(
  analysis: AnalysisResult,
  config: InterviewConfig,
  previousQuestions: string[] = []
): { text: string; category: QuestionCategory }[] {
  const distribution = CATEGORY_DISTRIBUTION[config.interviewType];
  const categories = distribution.slice(0, config.numQuestions);
  const questions: { text: string; category: QuestionCategory }[] = [];
  const askedQuestions = [...previousQuestions];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const prevEval = i > 0 && questions[i - 1] ? null : null;
    const text = generateQuestionForCategory(category, analysis, config, askedQuestions, prevEval, i);
    questions.push({ text, category });
    askedQuestions.push(text);
  }

  return questions;
}

export function generateNextQuestion(
  analysis: AnalysisResult,
  config: InterviewConfig,
  currentQuestionIndex: number,
  askedQuestions: string[],
  lastEvaluation: AnswerEvaluation | null,
  performanceHistory: number[]
): { text: string; category: QuestionCategory } {
  const distribution = CATEGORY_DISTRIBUTION[config.interviewType];
  let category: QuestionCategory;

  if (currentQuestionIndex + 1 < distribution.length) {
    category = distribution[currentQuestionIndex + 1];
  } else {
    category = 'technical';
  }

  if (lastEvaluation && performanceHistory.length >= 2) {
    const recentAvg = performanceHistory.slice(-2).reduce((a, b) => a + b, 0) / 2;

    if (recentAvg < 4 && config.difficulty !== 'easy') {
      const easierQuestions = TECHNICAL_QUESTIONS.easy;
      const askedSet = new Set(askedQuestions.map((q) => q.toLowerCase().slice(0, 60)));
      const q = pickRandom(easierQuestions, askedSet);
      if (q) return { text: q, category: 'technical' };
    }

    if (lastEvaluation.specificity < 4 && lastEvaluation.followUpReason) {
      const followUp = generateFollowUpQuestion(lastEvaluation, analysis, askedQuestions);
      if (followUp) return { text: followUp, category };
    }

    if (recentAvg >= 7 && config.difficulty === 'hard') {
      const hardQuestions = TECHNICAL_QUESTIONS.hard;
      const askedSet = new Set(askedQuestions.map((q) => q.toLowerCase().slice(0, 60)));
      const q = pickRandom(hardQuestions, askedSet);
      if (q) return { text: q, category: 'technical' };
    }
  }

  const text = generateQuestionForCategory(category, analysis, config, askedQuestions, lastEvaluation, currentQuestionIndex + 1);
  return { text, category };
}

function generateFollowUpQuestion(
  evaluation: AnswerEvaluation,
  analysis: AnalysisResult,
  askedQuestions: string[]
): string | null {
  if (evaluation.followUpReason && evaluation.followUpReason.length > 10) {
    return evaluation.followUpReason;
  }
  return null;
}

export function adjustDifficulty(
  baseDifficulty: Difficulty,
  performanceHistory: number[]
): Difficulty {
  if (performanceHistory.length < 2) return baseDifficulty;

  const recentAvg = performanceHistory.slice(-2).reduce((a, b) => a + b, 0) / 2;

  if (recentAvg >= 8 && baseDifficulty === 'easy') return 'medium';
  if (recentAvg >= 8.5 && baseDifficulty === 'medium') return 'hard';
  if (recentAvg < 3 && baseDifficulty === 'hard') return 'medium';
  if (recentAvg < 3 && baseDifficulty === 'medium') return 'easy';

  return baseDifficulty;
}
