import { useRef } from 'react';
import { useInterview } from '@/state/interviewState';
import { InterviewSetup } from '@/components/InterviewSetup';
import type { InterviewConfig } from '@/types';

export function SetupPage() {
  const { startAnalysis } = useInterview();
  const startedRef = useRef(false);

  function handleStart(config: InterviewConfig) {
    if (startedRef.current) return;
    startedRef.current = true;
    startAnalysis(config);
  }

  return <InterviewSetup onStart={handleStart} />;
}
