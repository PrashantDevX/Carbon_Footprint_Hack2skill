import { motion } from 'framer-motion';
import { Lightbulb, TrendingDown, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { generateInsights, totalPotentialSaving } from '@/lib/insights';
import { useCarbon } from '@/hooks/useCarbon';

const effortStyles: Record<string, string> = {
  easy: 'bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300',
  moderate: 'bg-earth-100 text-earth-700 dark:bg-earth-900/40 dark:text-earth-300',
  ambitious: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
};

export function InsightsPanel() {
  const { input, result } = useCarbon();
  const insights = generateInsights(input, result);
  const totalSaving = totalPotentialSaving(insights);
  const topInsights = insights.slice(0, 4);

  return (
    <Card className="h-full">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400">
            <Lightbulb className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personalized Insights</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ranked by potential impact</p>
          </div>
        </div>
        {totalSaving > 0 && (
          <div className="hidden sm:flex flex-col items-end rounded-xl bg-forest-50 px-3 py-2 dark:bg-forest-900/20">
            <span className="flex items-center gap-1 text-lg font-black text-forest-600 dark:text-forest-400">
              <TrendingDown className="h-4 w-4" aria-hidden="true" />-{totalSaving}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-forest-500/80">
              kg CO₂e/mo potential
            </span>
          </div>
        )}
      </div>

      {topInsights.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center dark:border-gray-700">
          <Sparkles className="mb-3 h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="font-semibold text-gray-900 dark:text-white">You're doing great!</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No high-impact reductions detected right now. Keep logging to refine your insights.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {topInsights.map((insight, index) => (
            <motion.li
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 transition-colors hover:border-forest-200 dark:border-gray-700/60 dark:bg-gray-900/40 dark:hover:border-forest-800"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${effortStyles[insight.effort]}`}
                >
                  {insight.effort}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
              {insight.potentialMonthlySaving > 0 && (
                <p className="mt-2 text-sm font-bold text-forest-600 dark:text-forest-400">
                  Save up to {insight.potentialMonthlySaving} kg CO₂e / month
                </p>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  );
}
