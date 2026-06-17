import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flag, Plus, Trash2, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useCarbon } from '@/hooks/useCarbon';
import { GOAL_HORIZON_DAYS } from '@/lib/constants';
import { isoDaysFromNow } from '@/lib/utils';
import type { CarbonCategory } from '@/types/carbon';

const categoryColor: Record<CarbonCategory, string> = {
  transport: 'text-sky-600 dark:text-sky-400',
  energy: 'text-earth-600 dark:text-earth-400',
  food: 'text-forest-600 dark:text-forest-400',
  shopping: 'text-purple-600 dark:text-purple-400',
  water: 'text-cyan-600 dark:text-cyan-400'
};

export function Goals() {
  const { goals, challenges, addGoal, removeGoal, toggleChallenge } = useCarbon();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CarbonCategory>('transport');
  const [targetKg, setTargetKg] = useState(20);

  const completedChallenges = challenges.filter((c) => c.completed).length;
  const totalPoints = challenges.filter((c) => c.completed).reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Goals &amp; Challenges</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Set reduction targets and complete weekly challenges to earn points.</p>
        </div>

        {/* Goals */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your reduction goals</h2>
          </div>

          {goals.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No goals yet. Create one on the right to start tracking your progress.
            </p>
          ) : (
            <div className="grid gap-3">
              {goals.map((goal) => {
                const progress = Math.min(100, Math.round((goal.currentKg / goal.targetKg) * 100));
                return (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-700/60 dark:bg-gray-900/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${categoryColor[goal.category]}`}>{goal.category}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.completed ? (
                          <CheckCircle2 className="text-forest-500" aria-label="Complete" />
                        ) : (
                          <Flag className="text-earth-500" aria-label="In progress" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeGoal(goal.id)}
                          aria-label={`Delete goal: ${goal.title}`}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-forest-500 to-forest-600"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{progress}%</span> · {goal.currentKg} of {goal.targetKg} kg CO₂e saved · due {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Challenges */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-earth-500" aria-hidden="true" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly challenges</h2>
            </div>
            <span className="rounded-full bg-forest-50 px-3 py-1 text-sm font-semibold text-forest-700 dark:bg-forest-900/40 dark:text-forest-300">
              {completedChallenges}/{challenges.length} · {totalPoints} pts
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => toggleChallenge(challenge.id)}
                aria-pressed={challenge.completed}
                className={`rounded-2xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 ${
                  challenge.completed
                    ? 'border-forest-300 bg-forest-50 dark:border-forest-700 dark:bg-forest-900/30'
                    : 'border-gray-200 hover:border-forest-300 dark:border-gray-700 dark:hover:border-forest-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{challenge.category}</p>
                  {challenge.completed && <CheckCircle2 className="h-4 w-4 text-forest-500" aria-hidden="true" />}
                </div>
                <h3 className="mt-1 font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                <p className="mt-2 text-sm font-medium text-forest-600 dark:text-forest-400">
                  {challenge.points} pts · {challenge.completed ? 'Completed ✓' : 'Tap to complete'}
                </p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Create goal */}
      <Card className="self-start">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create a goal</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pick something specific and achievable.</p>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            addGoal({ title: title.trim(), category, targetKg, dueDate: isoDaysFromNow(GOAL_HORIZON_DAYS) });
            setTitle('');
            setTargetKg(20);
          }}
        >
          <Field label="Goal title" placeholder="e.g. Bike to work 3 days/week" value={title} onChange={(event) => setTitle(event.target.value)} />
          <SelectField label="Category" value={category} onChange={(event) => setCategory(event.target.value as CarbonCategory)} options={[
            { value: 'transport', label: 'Transport' },
            { value: 'energy', label: 'Energy' },
            { value: 'food', label: 'Food' },
            { value: 'shopping', label: 'Shopping' },
            { value: 'water', label: 'Water' }
          ]} />
          <Field label="Target reduction" type="number" min={1} suffix="kg" value={targetKg} onChange={(event) => setTargetKg(Number(event.target.value))} />
          <Button type="submit" icon={<Plus size={18} />} disabled={!title.trim()}>Add goal</Button>
        </form>
      </Card>
    </div>
  );
}
