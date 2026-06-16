import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Award, Bot, Calculator as CalcIcon, Camera, Flag, Leaf, Target, Zap } from 'lucide-react';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { CarbonTrendChart } from '@/components/charts/CarbonTrendChart';
import { InsightsPanel } from '@/components/InsightsPanel';
import { Card } from '@/components/ui/Card';
import { useCarbon } from '@/hooks/useCarbon';
import { defaultInput } from '@/lib/defaultData';
import { formatKg } from '@/lib/utils';
import type { CarbonLog } from '@/types/carbon';
import { useAuth } from '@/contexts/AuthContext';

import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const { result, logs, goals, challenges } = useCarbon();
  const { user } = useAuth();
  const trendLogs = logs.length > 2 ? logs : buildDemoTrend(logs[0]);
  const activeGoals = goals.filter((goal) => !goal.completed).length;
  const completedChallenges = challenges.filter((challenge) => challenge.completed).length;
  const vsGlobal = result.comparison.percentVsGlobal;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Explorer'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is your carbon intelligence overview.</p>
        </div>
      </motion.div>

      {/* Quick actions — fast access to the main tools */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction to="/calculator" icon={<CalcIcon className="h-5 w-5" />} label="Log activity" hint="Update footprint" />
        <QuickAction to="/scanner" icon={<Camera className="h-5 w-5" />} label="Scan receipt" hint="AI vision" />
        <QuickAction to="/assistant" icon={<Bot className="h-5 w-5" />} label="Ask AI coach" hint="Get advice" />
        <QuickAction to="/goals" icon={<Flag className="h-5 w-5" />} label="Set a goal" hint="Track progress" />
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden relative border-0 shadow-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_220px]">
              <div>
                <p className="text-sm font-semibold text-forest-100 uppercase tracking-wider">Live Carbon Baseline</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                  {formatKg(result.monthlyKgCO2e)} <span className="text-2xl font-medium text-forest-200">CO₂e/mo</span>
                </h2>
                <p className="mt-4 max-w-2xl text-forest-100 leading-relaxed">
                  Your highest-impact category is <span className="font-bold text-white">{result.topCategory.label.toLowerCase()}</span>.
                  EcoTrack is ready with personalized goals, smart receipt scanning, and AI coaching to help you reduce this.
                </p>
              </div>
              <div className="grid place-items-center">
                <div className="relative grid h-44 w-44 place-items-center rounded-full border-[10px] border-white/20 backdrop-blur-sm bg-white/10 shadow-inner">
                  <span className="text-6xl font-black text-white">{result.score}</span>
                  <span className="absolute bottom-6 text-xs font-bold uppercase tracking-widest text-forest-200">Score</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full glass-panel dark:bg-gray-800/80 border-0 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-earth-500" /> Smart Next Action
              </h2>
              <div className="mt-6 rounded-2xl bg-earth-50 dark:bg-earth-900/20 border border-earth-100 dark:border-earth-800/50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Leaf className="w-24 h-24 text-earth-600" />
                </div>
                <p className="text-sm font-semibold text-earth-600 dark:text-earth-400 uppercase tracking-wider">{result.topCategory.label}</p>
                <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100 relative z-10 leading-snug">
                  "{result.topCategory.tips[0]}"
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={itemVariants}>
          <StatCard title="Annualized Footprint" value={formatKg(result.annualKgCO2e)} icon={<Leaf className="w-6 h-6" />} color="forest" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Vs Global Average"
            value={`${Math.abs(vsGlobal)}% ${vsGlobal > 0 ? 'over' : 'under'}`}
            icon={vsGlobal > 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            color={vsGlobal > 0 ? "danger" : "forest"}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Active Goals" value={String(activeGoals)} icon={<Target className="w-6 h-6" />} color="earth" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard title="Challenges Complete" value={String(completedChallenges)} icon={<Award className="w-6 h-6" />} color="sky" />
        </motion.div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <motion.div variants={itemVariants}>
          <Card className="glass-panel border-0 h-full">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Footprint Trend</h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">monthly kgCO₂e</span>
            </div>
            <CarbonTrendChart logs={trendLogs} />
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-panel border-0 h-full">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Category Breakdown</h2>
            <CategoryChart categories={result.categories} />
          </Card>
        </motion.div>
      </section>

      <motion.section variants={itemVariants}>
        <InsightsPanel />
      </motion.section>
    </motion.div>
  );
}

function QuickAction({ to, icon, label, hint }: { to: string; icon: JSX.Element; label: string; hint: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-forest-700"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-600 transition-colors group-hover:bg-forest-600 group-hover:text-white dark:bg-forest-900/40 dark:text-forest-400">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-gray-900 dark:text-white">{label}</span>
        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{hint}</span>
      </span>
    </Link>
  );
}

function StatCard({ title, value, icon, color = "forest" }: { title: string; value: string; icon: JSX.Element, color?: "forest" | "earth" | "danger" | "sky" }) {
  const colorStyles = {
    forest: "bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400",
    earth: "bg-earth-100 dark:bg-earth-900/30 text-earth-600 dark:text-earth-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    sky: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  };

  return (
    <Card className="glass flex items-center gap-5 border-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`grid h-14 w-14 place-items-center rounded-2xl ${colorStyles[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
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
