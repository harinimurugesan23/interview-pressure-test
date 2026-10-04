import { FeatureCard } from '@/components/FeatureCard';
import { Target, Brain, BarChart3, Map, ArrowRight, BookOpen } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
  onLearnMore: () => void;
}

export function HomePage({ onStart, onLearnMore }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            AI-Powered Interview Simulator
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Interview Pressure Test
          </h1>
          <p className="mt-4 text-xl font-medium text-slate-600 sm:text-2xl">
            Don't just practice interviews. Survive them.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Practice interviews tailored to the job you actually want. Get realistic questions,
            adaptive follow-ups, instant feedback, and a personalized preparation plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onStart}
              className="group flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Start Your Interview
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onLearnMore}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              <BookOpen className="h-5 w-5" />
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon="target"
            title="Job-Specific Questions"
            description="Questions are generated from your actual job description, not generic templates."
          />
          <FeatureCard
            icon="brain"
            title="Adaptive Follow-Ups"
            description="The interviewer changes follow-up questions based on your answers and performance."
          />
          <FeatureCard
            icon="chart"
            title="Instant Feedback"
            description="Get detailed feedback on technical depth, clarity, relevance, and communication."
          />
          <FeatureCard
            icon="map"
            title="Personalized Preparation"
            description="Receive a 3-day preparation plan targeting your actual weak areas."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-900">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '1', title: 'Add your resume', desc: 'Paste your resume text so the AI understands your background.' },
              { num: '2', title: 'Add the job description', desc: 'Paste the JD for the role you want to practice for.' },
              { num: '3', title: 'Face the AI interviewer', desc: 'Answer adaptive questions that probe your real knowledge.' },
              { num: '4', title: 'Get your report', desc: 'See your performance breakdown and a personalized prep plan.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Start Your Interview
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Privacy-first:</span> Your resume and
            answers are used only for your current session. Nothing is stored, logged, or sent
            to external servers.
          </p>
        </div>
      </section>
    </div>
  );
}
