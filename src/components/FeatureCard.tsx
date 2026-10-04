import { Target, Brain, BarChart3, Map } from 'lucide-react';

interface FeatureCardProps {
  icon: 'target' | 'brain' | 'chart' | 'map';
  title: string;
  description: string;
}

const iconMap = {
  target: Target,
  brain: Brain,
  chart: BarChart3,
  map: Map,
};

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const Icon = iconMap[icon];
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 transition-transform group-hover:scale-105">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
