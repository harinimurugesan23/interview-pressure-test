import { InterviewProvider, useInterview } from '@/state/interviewState';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/Home';
import { SetupPage } from '@/pages/Setup';
import { AnalysisPage } from '@/pages/Analysis';
import { InterviewPage } from '@/pages/Interview';
import { ReportPage } from '@/pages/Report';

function AppContent() {
  const { state, goToPage } = useInterview();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {state.currentPage === 'home' && (
        <HomePage
          onStart={() => goToPage('setup')}
          onLearnMore={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else goToPage('setup');
          }}
        />
      )}
      {state.currentPage === 'setup' && <SetupPage />}
      {state.currentPage === 'analysis' && <AnalysisPage />}
      {state.currentPage === 'interview' && <InterviewPage />}
      {state.currentPage === 'report' && <ReportPage />}

      <footer className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
          Interview Pressure Test — AI-powered mock interview simulator. Session-based, no data stored.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
}
