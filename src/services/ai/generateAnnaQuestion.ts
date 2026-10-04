import { askAnna } from '@/services/annaLlm';
import type {
  AnalysisResult,
  InterviewConfig,
  AnswerEvaluation,
  QuestionCategory,
} from '@/types';

export async function generateAnnaQuestion(
  analysis: AnalysisResult,
  config: InterviewConfig,
  currentQuestion: string,
  lastEvaluation: AnswerEvaluation | null,
  askedQuestions: string[]
): Promise<{ text: string; category: QuestionCategory }> {
  const prompt = `
You are a professional technical interviewer.

Generate ONE interview question for a candidate.

Candidate skills:
${analysis.candidateSkills.join(', ')}

Required job skills:
${analysis.requiredSkills.join(', ')}

Projects:
${analysis.projects.join('; ')}

Experience:
${analysis.experience.join('; ')}

Interview type: ${config.interviewType}
Difficulty: ${config.difficulty}

Previous question:
${currentQuestion}

Previous evaluation:
${lastEvaluation ? JSON.stringify(lastEvaluation) : 'No previous evaluation'}

Questions already asked:
${askedQuestions.join('\n')}

Rules:
- Ask exactly ONE question.
- Make it specific to the candidate and target role.
- Do not repeat an earlier question.
- If the previous answer was weak, ask a useful follow-up.
- Match the requested difficulty.
- Return ONLY the question text.
`;

  try {
    const response = await askAnna(prompt);

    const text =
      typeof response === 'string'
        ? response
        : response?.text ||
          response?.content ||
          response?.choices?.[0]?.message?.content ||
          '';

    const cleanQuestion = String(text).trim();

    if (cleanQuestion) {
      return {
        text: cleanQuestion,
        category: 'technical',
      };
    }
  } catch (error) {
    console.error('Anna question generation failed:', error);
  }

  throw new Error('Anna could not generate a question');
}
