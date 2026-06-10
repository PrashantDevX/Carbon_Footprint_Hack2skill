import { ArrowDownRight, ArrowUpRight, Award, Leaf, Target } from 'lucide-react';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { CarbonTrendChart } from '@/components/charts/CarbonTrendChart';
import { Card } from '@/components/ui/Card';
import { useCarbon } from '@/hooks/useCarbon';
import { defaultInput } from '@/lib/defaultData';
import { formatKg } from '@/lib/utils';
import type { CarbonLog } from '@/types/carbon';

export function Dashboard() {
  const { result, logs, goals, challenges } = useCarbon();
  const trendLogs = logs.length > 2 ? logs : buildDemoTrend(logs[0]);
  const activeGoals = goals.filter((goal) => !goal.completed).length;
  const completedChallenges = challenges.filter((challenge) => challenge.completed).length;
  const vsGlobal = result.comparison.percentVsGlobal;

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#ecfdf5_62%,#fff7ed_100%)]">
          <div className="grid gap-5 md:grid-cols-[1fr_220px]">
            <div>
              <p className="text-sm font-semibold text-leaf">Live carbon baseline</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-4xl">
                {formatKg(result.monthlyKgCO2e)} CO2e this month
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Your highest-impact category is {result.topCategory.label.toLowerCase()}.
                EcoTrack is ready with goals, receipt logging, local alternatives, and AI coaching.
              </p>
            </div>
            <div className="grid place-items-center">
              <div className="relative grid h-44 w-44 place-items-center rounded-full border-[14px] border-teal-100 bg-white">
                <span className="text-5xl font-black text-leaf">{result.score}</span>
                <span className="absolute bottom-9 text-xs font-bold uppercase text-slate-500">score</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Smart next action</h2>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">{result.topCategory.label}</p>
            <p className="mt-2 text-xl font-black">{result.topCategory.tips[0]}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Annualized footprint" value={formatKg(result.annualKgCO2e)} icon={<Leaf />} />
        <StatCard
          title="Vs global average"
          value={`${Math.abs(vsGlobal)}% ${vsGlobal > 0 ? 'over' : 'under'}`}
          icon={vsGlobal > 0 ? <ArrowUpRight /> : <ArrowDownRight />}
        />
        <StatCard title="Active goals" value={String(activeGoals)} icon={<Target />} />
        <StatCard title="Challenges complete" value={String(completedChallenges)} icon={<Award />} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Footprint trend</h2>
            <span className="text-sm text-slate-500">monthly kgCO2e</span>
          </div>
          <CarbonTrendChart logs={trendLogs} />
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">Category breakdown</h2>
          <CategoryChart categories={result.categories} />
        </Card>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: JSX.Element }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-leaf">{icon}</span>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </Card>
  );
}

function buildDemoTrend(log?: CarbonLog): CarbonLog[] {
  const base = log?.result.monthlyKgCO2e ?? 540;
  return [4, 3, 2, 1, 0].map((monthsAgo) => ({
    id: `demo-${monthsAgo}`,
    createdAt: new Date(Date.now() - monthsAgo * 30 * 24 * 60 * 60 * 1000).toISOString(),
    input: log?.input ?? defaultInput,
    result: {
      ...(log?.result ?? {
        annualKgCO2e: base * 12,
        score: 70,
        categories: [],
        topCategory: { category: 'energy', kgCO2e: 150, label: 'Home energy', tips: [] },
        comparison: {
          globalMonthlyAverage: 950,
          nationalMonthlyAverage: 1600,
          percentVsGlobal: -40
        }
      }),
      monthlyKgCO2e: base + monthsAgo * 28
    }
  }));
}
