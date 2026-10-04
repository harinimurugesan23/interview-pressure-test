import { generateAnnaQuestion } from '@/services/ai/generateAnnaQuestion';
import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  InterviewConfig,
  AnalysisResult,
  InterviewState,
  QuestionResult,
  AnswerEvaluation,
  QuestionCategory,
  FinalReport,
  Page,
} from '@/types';
import {
  analyzeResumeAndJD,
  generateOpeningQuestion,
  generateNextQuestion,
  evaluateAnswer,
  generateBetterAnswerGuidanceForQuestion,
  generateFinalReport,
  adjustDifficulty,
} from '@/services/ai';

type Action =
  | { type: 'SET_CONFIG'; config: InterviewConfig }
  | { type: 'SET_ANALYSIS'; analysis: AnalysisResult }
  | { type: 'SET_PAGE'; page: Page }
  | { type: 'SET_CURRENT_QUESTION'; text: string; category: QuestionCategory }
  | { type: 'ADD_RESULT'; result: QuestionResult }
  | { type: 'ADVANCE_INDEX' }
  | { type: 'ADD_TO_HISTORY'; score: number }
  | { type: 'SET_COMPLETE' }
  | { type: 'SET_REPORT'; report: FinalReport }
  | { type: 'RESET_KEEP_INPUTS'; previousQuestions: string[] }
  | { type: 'RESET_ALL' };

const initialState: InterviewState = {
  config: null,
  analysis: null,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestionText: '',
  currentQuestionCategory: 'introduction' as QuestionCategory,
  isComplete: false,
  askedQuestions: [],
  performanceHistory: [],
  usedSkills: [],
  previousInterviewQuestions: [],
};

interface FullState extends InterviewState {
  currentPage: Page;
  report: FinalReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialFullState: FullState = {
  ...initialState,
  currentPage: 'home',
  report: null,
  isLoading: false,
  error: null,
};

function reducer(state: FullState, action: Action): FullState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: action.config, error: null };
    case 'SET_ANALYSIS':
      return { ...state, analysis: action.analysis, error: null };
    case 'SET_PAGE':
      return { ...state, currentPage: action.page, error: null };
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestionText: action.text,
        currentQuestionCategory: action.category,
      };
    case 'ADD_RESULT':
      return {
        ...state,
        questions: [...state.questions, action.result],
        askedQuestions: [...state.askedQuestions, action.result.question],
      };
    case 'ADVANCE_INDEX':
      return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
    case 'ADD_TO_HISTORY':
      return { ...state, performanceHistory: [...state.performanceHistory, action.score] };
    case 'SET_COMPLETE':
      return { ...state, isComplete: true };
    case 'SET_REPORT':
      return { ...state, report: action.report };
    case 'RESET_KEEP_INPUTS':
      return {
        ...initialFullState,
        config: state.config,
        analysis: state.analysis,
        currentPage: 'interview',
        previousInterviewQuestions: action.previousQuestions,
      };
    case 'RESET_ALL':
      return initialFullState;
    default:
      return state;
  }
}

interface InterviewContextValue {
  state: FullState;
  startAnalysis: (config: InterviewConfig) => void;
  enterInterview: () => void;
  submitAnswer: (answer: string, skipped: boolean) => void;
  goToPage: (page: Page) => void;
  practiceAgain: () => void;
  startNew: () => void;
  clearError: () => void;
}

const InterviewContext = createContext<InterviewContextValue | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialFullState);

  const startAnalysis = useCallback((config: InterviewConfig) => {
    dispatch({ type: 'SET_CONFIG', config });
    try {
      const analysis = analyzeResumeAndJD(config);
      dispatch({ type: 'SET_ANALYSIS', analysis });
      dispatch({ type: 'SET_PAGE', page: 'analysis' });
    } catch {
      dispatch({ type: 'SET_PAGE', page: 'setup' });
    }
  }, []);

  const enterInterview = useCallback(() => {
    if (!state.config || !state.analysis) return;
    const opening = generateOpeningQuestion(state.analysis, state.config);
    dispatch({ type: 'SET_CURRENT_QUESTION', text: opening.text, category: opening.category });
    dispatch({ type: 'SET_PAGE', page: 'interview' });
  }, [state.config, state.analysis]);

  const submitAnswer = useCallback(
    async (answer: string, skipped: boolean) => {
      if (!state.config || !state.analysis) return;

      const evaluation: AnswerEvaluation = evaluateAnswer(
        answer,
        state.currentQuestionText,
        state.currentQuestionCategory,
        state.analysis,
        state.config,
        skipped
      );

      const betterAnswerGuidance = skipped
        ? 'Attempt every question even if unsure — interviewers value seeing your thought process.'
        : generateBetterAnswerGuidanceForQuestion(
            state.currentQuestionText,
            answer,
            state.currentQuestionCategory,
            evaluation
          );

      const result: QuestionResult = {
        question: state.currentQuestionText,
        category: state.currentQuestionCategory,
        answer: skipped ? '[Skipped]' : answer,
        skipped,
        evaluation,
        betterAnswerGuidance,
      };

      dispatch({ type: 'ADD_RESULT', result });

      const avgScore =
        (evaluation.relevance + evaluation.technicalAccuracy + evaluation.clarity + evaluation.specificity + evaluation.completeness) / 5;
      dispatch({ type: 'ADD_TO_HISTORY', score: avgScore });

      const nextIndex = state.currentQuestionIndex + 1;

      if (nextIndex >= state.config.numQuestions) {
        const allResults = [...state.questions, result];
        const report = generateFinalReport(allResults, state.analysis, state.config);
        dispatch({ type: 'SET_REPORT', report });
        dispatch({ type: 'SET_COMPLETE' });
        dispatch({ type: 'SET_PAGE', page: 'report' });
        return;
      }

      const adjustedDifficulty = adjustDifficulty(state.config.difficulty, [...state.performanceHistory, avgScore]);
      const adjustedConfig = { ...state.config, difficulty: adjustedDifficulty };
      let next;

      try {
        next = await generateAnnaQuestion(
          state.analysis,
          adjustedConfig,
          state.currentQuestionText,
          evaluation,
          [...state.askedQuestions, state.currentQuestionText]
        );
      } catch (error) {
        console.error('Anna interview question failed:', error);

        next = generateNextQuestion(
          state.analysis,
          adjustedConfig,
          state.currentQuestionIndex,
          [...state.askedQuestions, state.currentQuestionText],
          evaluation,
          [...state.performanceHistory, avgScore]
        );
      }

      dispatch({ type: 'ADVANCE_INDEX' });
      dispatch({
        type: 'SET_CURRENT_QUESTION',
        text: next.text,
        category: next.category,
      });
    },
    [state.config, state.analysis, state.currentQuestionText, state.currentQuestionCategory, state.currentQuestionIndex, state.questions, state.askedQuestions, state.performanceHistory]
  );

  const goToPage = useCallback((page: Page) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const practiceAgain = useCallback(() => {
    const previousQuestions = state.questions.map((q) => q.question);
    dispatch({ type: 'RESET_KEEP_INPUTS', previousQuestions });

    if (state.config && state.analysis) {
      const opening = generateOpeningQuestion(state.analysis, state.config);
      dispatch({ type: 'SET_CURRENT_QUESTION', text: opening.text, category: opening.category });
    }
  }, [state.config, state.analysis, state.questions]);

  const startNew = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_PAGE', page: state.currentPage });
  }, [state.currentPage]);

  return (
    <InterviewContext.Provider
      value={{
        state,
        startAnalysis,
        enterInterview,
        submitAnswer,
        goToPage,
        practiceAgain,
        startNew,
        clearError,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider');
  return ctx;
}


