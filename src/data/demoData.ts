import type { AnalysisResult, InterviewConfig, QuestionResult, FinalReport, AnswerEvaluation, QuestionCategory } from '@/types';

export const DEMO_RESUME = `John Doe
Email: john.doe@email.com | Phone: +1-555-0100 | Location: San Francisco, CA

EDUCATION
B.Tech in Computer Science, University of California, Berkeley (2020-2024)
GPA: 3.7/4.0

SKILLS
Programming Languages: Java, Python, JavaScript, SQL
Frameworks: React, Node.js, Spring Boot
Databases: MySQL, MongoDB
Tools: Git, Docker, Jenkins
Concepts: REST APIs, Data Structures, Algorithms, OOP

EXPERIENCE
Software Engineering Intern - TechCorp Inc. (Summer 2023)
- Developed REST API endpoints using Spring Boot for internal dashboard
- Built React frontend components for data visualization
- Collaborated with team of 5 engineers using Agile methodology
- Wrote unit tests achieving 80% code coverage

PROJECTS
1. E-Commerce Platform (Full Stack Project)
- Built using React frontend and Spring Boot backend
- Implemented JWT authentication and role-based access control
- Used MySQL for product catalog and order management
- Deployed on AWS EC2 with Docker containers

2. Task Management App
- React and Node.js based task management application
- Implemented real-time updates using WebSockets
- Used MongoDB for flexible task data storage
- Added notification system for task deadlines

3. Library Management System
- Java-based console application using OOP principles
- Implemented CRUD operations with MySQL backend
- Designed normalized database schema
- Added search and filter functionality`;

export const DEMO_JOB_DESCRIPTION = `Software Engineer - Backend

Company: CloudTech Solutions
Location: Remote / San Francisco, CA

About the Role:
We are seeking a motivated Software Engineer to join our backend team. You will be responsible for building and maintaining scalable REST API services that power our cloud platform.

Required Skills:
- Strong proficiency in Java
- Experience with REST API design and development
- Solid understanding of SQL and relational databases
- Knowledge of data structures and algorithms
- Familiarity with Git version control
- Understanding of HTTP protocols and web fundamentals

Preferred Skills:
- Experience with Spring Boot or similar Java frameworks
- Knowledge of React or modern frontend frameworks
- Experience with cloud platforms (AWS, GCP, or Azure)
- Understanding of containerization (Docker)
- CI/CD pipeline experience

Responsibilities:
- Design, develop, and maintain REST API services
- Write clean, testable, and maintainable code
- Collaborate with frontend engineers and product managers
- Participate in code reviews and technical discussions
- Troubleshoot and resolve production issues
- Contribute to system architecture decisions

Requirements:
- Bachelor's degree in Computer Science or related field
- 0-2 years of professional experience (internships count)
- Strong problem-solving skills
- Excellent communication skills
- Ability to work in an Agile environment

What We Offer:
- Competitive salary and equity
- Health, dental, and vision insurance
- Flexible work arrangements
- Learning and development budget`;

export const DEMO_CONFIG: InterviewConfig = {
  resume: DEMO_RESUME,
  jobDescription: DEMO_JOB_DESCRIPTION,
  experienceLevel: 'fresher',
  interviewType: 'mixed',
  difficulty: 'medium',
  numQuestions: 5,
};

export function getDemoAnalysis(): AnalysisResult {
  return {
    jobTitle: 'Software Engineer - Backend',
    requiredSkills: ['Java', 'REST API design', 'SQL', 'Data structures and algorithms', 'Git', 'HTTP protocols'],
    preferredSkills: ['Spring Boot', 'React', 'Cloud platforms (AWS/GCP/Azure)', 'Docker', 'CI/CD'],
    responsibilities: [
      'Design, develop, and maintain REST API services',
      'Write clean, testable, and maintainable code',
      'Collaborate with frontend engineers and product managers',
      'Participate in code reviews and technical discussions',
      'Troubleshoot and resolve production issues',
      'Contribute to system architecture decisions',
    ],
    technologies: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git', 'Docker', 'AWS', 'React'],
    experienceRequirements: '0-2 years of professional experience (internships count)',
    keywords: ['Java', 'REST API', 'SQL', 'backend', 'scalable', 'Agile', 'code reviews', 'architecture'],
    likelyInterviewAreas: [
      'Java fundamentals and OOP concepts',
      'REST API design principles',
      'SQL queries and database design',
      'Data structures and algorithms',
      'System design basics',
      'Project deep dive on backend experience',
      'Behavioral and teamwork questions',
    ],
    candidateSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'React', 'Node.js', 'Spring Boot', 'MySQL', 'MongoDB', 'Git', 'Docker'],
    projects: [
      'E-Commerce Platform (React + Spring Boot, JWT auth, MySQL, AWS/Docker)',
      'Task Management App (React + Node.js, WebSockets, MongoDB)',
      'Library Management System (Java + MySQL, OOP)',
    ],
    experience: ['Software Engineering Intern at TechCorp Inc. (Summer 2023) - Spring Boot REST APIs, React frontend, unit tests'],
    education: ['B.Tech in Computer Science, UC Berkeley (2020-2024), GPA 3.7/4.0'],
    candidateTechnologies: ['Java', 'React', 'Node.js', 'Spring Boot', 'MySQL', 'MongoDB', 'Git', 'Docker', 'AWS EC2'],
    strengths: [
      'Strong Java experience matching the primary requirement',
      'Has built REST APIs with Spring Boot during internship',
      'SQL experience with MySQL',
      'React experience matching preferred skills',
      'Docker and AWS exposure from projects',
      'Good academic foundation with relevant CS degree',
    ],
    weakAreas: [
      'Limited professional experience (internship only)',
      'No explicit CI/CD pipeline experience mentioned',
      'Cloud platform experience is project-level, not production-level',
      'No mention of system design or scalability topics',
    ],
    claimsToQuestion: [
      'JWT authentication implementation details in e-commerce project',
      'Database normalization approach in library system',
      'WebSocket implementation details in task management app',
      'Docker containerization specifics in e-commerce deployment',
      'Spring Boot REST API design decisions at internship',
    ],
    skillMatches: [
      { skill: 'Java', level: 'strong' },
      { skill: 'REST APIs', level: 'strong' },
      { skill: 'SQL', level: 'strong' },
      { skill: 'Git', level: 'strong' },
      { skill: 'React', level: 'partial' },
      { skill: 'Spring Boot', level: 'partial' },
      { skill: 'Docker', level: 'partial' },
      { skill: 'AWS/Cloud', level: 'partial' },
      { skill: 'CI/CD', level: 'missing' },
      { skill: 'System Design', level: 'missing' },
    ],
    focusAreas: ['Java', 'REST APIs', 'SQL', 'React', 'Project experience', 'Problem solving'],
    briefing:
      'Your resume shows strong Java and REST API experience through your internship and e-commerce project, which aligns well with the backend engineer role. The job description emphasizes scalable REST API services and SQL — areas you have direct experience with. Expect questions around Java fundamentals, REST API design, SQL queries, your project architecture decisions, and some behavioral questions about teamwork. Areas like CI/CD and system design may be probed since they appear in the JD but are less prominent in your resume.',
  };
}
