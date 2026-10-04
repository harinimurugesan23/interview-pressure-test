import type {
  AnalysisResult,
  InterviewConfig,
  SkillMatch,
  MatchLevel,
  QuestionCategory,
  ExperienceLevel,
  InterviewType,
  Difficulty,
} from '@/types';

const COMMON_SKILLS = [
  'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'go', 'ruby', 'kotlin', 'swift',
  'react', 'angular', 'vue', 'node.js', 'express', 'spring boot', 'django', 'flask', 'next.js',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'jenkins', 'git', 'github',
  'rest api', 'graphql', 'microservices', 'ci/cd', 'terraform',
  'html', 'css', 'tailwind', 'bootstrap', 'sass',
  'data structures', 'algorithms', 'oop', 'system design', 'operating systems',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp',
  'agile', 'scrum', 'jira', 'tdd', 'unit testing', 'jest', 'junit',
  'kafka', 'rabbitmq', 'elasticsearch', 'nginx',
  'http', 'tcp/ip', 'dns', 'linux', 'bash',
];

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'as', 'if', 'then', 'else',
  'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up',
  'down', 'out', 'off', 'over', 'under', 'again', 'further', 'once', 'here',
  'there', 'your', 'our', 'their', 'its', 'my', 'me', 'him', 'her', 'us', 'them',
  'will', 'shall', 'may', 'might', 'must', 'need', 'dare', 'used', 'using',
  'role', 'position', 'job', 'work', 'working', 'team', 'company', 'candidate',
  'experience', 'year', 'years', 'skill', 'skills', 'ability', 'strong', 'good',
  'responsible', 'responsibilities', 'requirements', 'required', 'preferred',
  'plus', 'etc', 'including', 'within', 'across', 'along', 'among',
]);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s+#.-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractKeywords(text: string, minLen: number = 3): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(' ');
  const freq: Record<string, number> = {};

  for (const word of words) {
    if (word.length < minLen) continue;
    if (STOP_WORDS.has(word)) continue;
    if (/^\d+$/.test(word)) continue;
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word]) => word);
}

function findSkillsInText(text: string): string[] {
  const normalized = ' ' + normalizeText(text) + ' ';
  const found = new Set<string>();

  for (const skill of COMMON_SKILLS) {
    const skillNorm = skill.toLowerCase();
    const pattern = new RegExp(`(?<![\\w+#])${escapeRegex(skillNorm)}(?![\\w+#])`, 'i');
    if (pattern.test(normalized)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSections(text: string, sectionNames: string[]): string[] {
  const lines = text.split('\n');
  const results: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const upperTrimmed = trimmed.toUpperCase().replace(/[^A-Z]/g, '');
    const isHeader = sectionNames.some((name) => {
      const nameClean = name.toUpperCase().replace(/[^A-Z]/g, '');
      return upperTrimmed === nameClean || upperTrimmed.startsWith(nameClean);
    });

    if (isHeader && trimmed.length < 40) {
      inSection = true;
      continue;
    }

    if (inSection && trimmed.length > 0) {
      if (/^[A-Z\s]{3,30}$/.test(trimmed) && trimmed.length < 30) {
        inSection = false;
        continue;
      }
      results.push(trimmed);
    }
  }

  return results;
}

function extractProjects(resumeText: string): string[] {
  const lines = resumeText.split('\n');
  const projects: string[] = [];
  let inProjects = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^projects?$/i.test(trimmed)) {
      inProjects = true;
      continue;
    }
    if (inProjects) {
      if (/^(experience|education|skills|certifications|awards|languages|interests)$/i.test(trimmed)) {
        inProjects = false;
        continue;
      }
      if (trimmed.length > 0) {
        projects.push(trimmed);
      }
    }
  }

  if (projects.length === 0) {
    const numbered = resumeText.match(/\d+\.\s+([^\n]+)/g);
    if (numbered) {
      return numbered.map((m) => m.replace(/^\d+\.\s+/, ''));
    }
  }

  return projects;
}

function extractExperience(resumeText: string): string[] {
  const lines = resumeText.split('\n');
  const experience: string[] = [];
  let inExperience = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^experience$/i.test(trimmed) || /^work\s+experience$/i.test(trimmed) || /^professional\s+experience$/i.test(trimmed)) {
      inExperience = true;
      continue;
    }
    if (inExperience) {
      if (/^(projects?|education|skills|certifications|awards|languages|interests)$/i.test(trimmed)) {
        inExperience = false;
        continue;
      }
      if (trimmed.length > 0) {
        experience.push(trimmed);
      }
    }
  }

  return experience;
}

function extractEducation(resumeText: string): string[] {
  return extractSections(resumeText, ['education']);
}

function determineMatchLevel(skill: string, resumeSkills: string[], resumeText: string): MatchLevel {
  const skillLower = skill.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  for (const rs of resumeSkills) {
    if (rs.toLowerCase() === skillLower) return 'strong';
  }

  if (resumeLower.includes(skillLower)) return 'partial';

  const skillWords = skillLower.split(/[\s/]+/);
  if (skillWords.length > 1) {
    const allFound = skillWords.every((w) => resumeLower.includes(w));
    if (allFound) return 'partial';
  }

  return 'missing';
}

function buildSkillMatches(jdSkills: string[], resumeSkills: string[], resumeText: string): SkillMatch[] {
  const matches: SkillMatch[] = [];
  const seen = new Set<string>();

  for (const skill of jdSkills) {
    const key = skill.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push({
      skill,
      level: determineMatchLevel(skill, resumeSkills, resumeText),
    });
  }

  for (const skill of resumeSkills) {
    const key = skill.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      matches.push({ skill, level: 'strong' });
    }
  }

  return matches;
}

function extractJobTitle(jdText: string): string {
  const lines = jdText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  for (const line of lines.slice(0, 10)) {
    if (/(engineer|developer|designer|analyst|manager|specialist|consultant|architect|administrator|lead|intern|associate)/i.test(line)) {
      return line.replace(/^.*?:\s*/, '').replace(/^position\s*:?\s*/i, '').trim();
    }
  }
  return lines[0] || 'Unknown Position';
}

function extractResponsibilities(jdText: string): string[] {
  const lines = jdText.split('\n');
  const responsibilities: string[] = [];
  let inResp = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^responsibilities/i.test(trimmed) || /^what you'?ll do/i.test(trimmed) || /^about the role/i.test(trimmed)) {
      inResp = true;
      continue;
    }
    if (inResp) {
      if (/^(required|preferred|qualifications|requirements|what we offer|nice to have|skills)/i.test(trimmed)) {
        inResp = false;
        continue;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        responsibilities.push(trimmed.replace(/^[-•]\s*/, ''));
      }
    }
  }

  if (responsibilities.length === 0) {
    for (const line of lines) {
      const trimmed = line.trim();
      if ((trimmed.startsWith('-') || trimmed.startsWith('•')) && trimmed.length > 15) {
        responsibilities.push(trimmed.replace(/^[-•]\s*/, ''));
      }
    }
  }

  return responsibilities.slice(0, 10);
}

function extractRequirements(jdText: string): string {
  const match = jdText.match(/(\d+[-–]\d+\s*years|\d+\+\s*years|entry[\s-]*level|junior|senior|lead)/i);
  return match ? match[0].trim() : 'Not specified';
}

function inferWeakAreas(resumeSkills: string[], jdSkills: string[], skillMatches: SkillMatch[]): string[] {
  const weak: string[] = [];
  for (const sm of skillMatches) {
    if (sm.level === 'missing') {
      weak.push(sm.skill);
    }
  }
  if (resumeSkills.length < 5) {
    weak.push('Limited skills listed on resume');
  }
  return weak;
}

function inferStrengths(skillMatches: SkillMatch[], resumeProjects: string[]): string[] {
  const strengths: string[] = [];
  for (const sm of skillMatches) {
    if (sm.level === 'strong') {
      strengths.push(`Experience with ${sm.skill}`);
    }
  }
  if (resumeProjects.length >= 2) {
    strengths.push('Multiple projects demonstrating practical experience');
  }
  return strengths;
}

function inferClaimsToQuestion(projects: string[], experience: string[]): string[] {
  const claims: string[] = [];
  for (const project of projects.slice(0, 3)) {
    const techMentions: string[] = [];
    const techKeywords = ['react', 'spring', 'docker', 'aws', 'mongodb', 'mysql', 'jwt', 'websocket', 'node', 'api', 'sql'];
    const lower = project.toLowerCase();
    for (const kw of techKeywords) {
      if (lower.includes(kw)) techMentions.push(kw);
    }
    if (techMentions.length > 0) {
      const projName = project.split('(')[0].split('-')[0].trim() || project.slice(0, 40);
      claims.push(`Details of ${projName} — specifically ${techMentions.slice(0, 2).join(' and ')} implementation`);
    }
  }
  return claims.slice(0, 5);
}

function buildBriefing(
  resumeSkills: string[],
  jdSkills: string[],
  skillMatches: SkillMatch[],
  experienceLevel: ExperienceLevel
): string {
  const strongMatches = skillMatches.filter((s) => s.level === 'strong').map((s) => s.skill);
  const missingMatches = skillMatches.filter((s) => s.level === 'missing').map((s) => s.skill);
  const partialMatches = skillMatches.filter((s) => s.level === 'partial').map((s) => s.skill);

  const expLabel = experienceLevel === '5+' ? 'experienced' : experienceLevel === 'fresher' ? 'entry-level' : 'mid-level';

  let briefing = `Your resume shows ${strongMatches.length > 0 ? `strengths in ${strongMatches.slice(0, 4).join(', ')}` : 'some relevant skills'}`;

  if (partialMatches.length > 0) {
    briefing += `, with partial exposure to ${partialMatches.slice(0, 3).join(', ')}`;
  }

  briefing += `. The job description emphasizes ${jdSkills.slice(0, 4).join(', ')}${jdSkills.length > 4 ? ', and related areas' : ''}.`;

  if (missingMatches.length > 0) {
    briefing += ` Areas like ${missingMatches.slice(0, 2).join(' and ')} appear in the JD but are less prominent in your resume, so expect probing questions there.`;
  }

  briefing += ` As a ${expLabel} candidate, expect a mix of technical fundamentals, project deep-dives, and behavioral questions.`;

  return briefing;
}

function determineFocusAreas(jdSkills: string[], resumeSkills: string[], skillMatches: SkillMatch[]): string[] {
  const focus = new Set<string>();

  for (const sm of skillMatches) {
    if (sm.level === 'strong' || sm.level === 'partial') {
      focus.add(sm.skill);
    }
  }

  focus.add('Project experience');
  focus.add('Problem solving');

  return Array.from(focus).slice(0, 8);
}

export function analyzeResumeAndJD(config: InterviewConfig): AnalysisResult {
  const { resume, jobDescription } = config;

  const jdSkills = findSkillsInText(jobDescription);
  const resumeSkills = findSkillsInText(resume);
  const allKeywords = extractKeywords(jobDescription + ' ' + resume);

  const skillMatches = buildSkillMatches(jdSkills, resumeSkills, resume);

  const projects = extractProjects(resume);
  const experience = extractExperience(resume);
  const education = extractEducation(resume);

  const jobTitle = extractJobTitle(jobDescription);
  const responsibilities = extractResponsibilities(jobDescription);
  const experienceRequirements = extractRequirements(jobDescription);

  const likelyInterviewAreas: string[] = [];
  for (const skill of jdSkills.slice(0, 4)) {
    likelyInterviewAreas.push(`${skill} fundamentals and concepts`);
  }
  likelyInterviewAreas.push('Project deep dive on relevant experience');
  likelyInterviewAreas.push('Behavioral and teamwork questions');

  const strengths = inferStrengths(skillMatches, projects);
  const weakAreas = inferWeakAreas(resumeSkills, jdSkills, skillMatches);
  const claimsToQuestion = inferClaimsToQuestion(projects, experience);

  const focusAreas = determineFocusAreas(jdSkills, resumeSkills, skillMatches);
  const briefing = buildBriefing(resumeSkills, jdSkills, skillMatches, config.experienceLevel);

  return {
    jobTitle,
    requiredSkills: jdSkills.slice(0, 10),
    preferredSkills: jdSkills.slice(5, 15),
    responsibilities,
    technologies: Array.from(new Set([...jdSkills, ...resumeSkills])).slice(0, 15),
    experienceRequirements,
    keywords: allKeywords.slice(0, 15),
    likelyInterviewAreas,
    candidateSkills: resumeSkills,
    projects,
    experience,
    education,
    candidateTechnologies: resumeSkills,
    strengths,
    weakAreas,
    claimsToQuestion,
    skillMatches,
    focusAreas,
    briefing,
  };
}
