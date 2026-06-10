import { CheckCircle2, Flag, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, SelectField } from '@/components/ui/Field';
import { useCarbon } from '@/hooks/useCarbon';
import type { CarbonCategory } from '@/types/carbon';

export function Goals() {
  const { goals, challenges, addGoal, toggleChallenge } = useCarbon();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CarbonCategory>('transport');
  const [targetKg, setTargetKg] = useState(20);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-5">
        <Card>
          <h1 className="text-2xl font-black">Goals and challenges</h1>
          <div className="mt-5 grid gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold capitalize text-leaf">{goal.category}</p>
                    <h2 className="text-lg font-black">{goal.title}</h2>
                  </div>
                  {goal.completed ? <CheckCircle2 className="text-leaf" aria-label="Complete" /> : <Flag className="text-sun" aria-label="In progress" />}
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-leaf" style={{ width: `${Math.min(100, (goal.currentKg / goal.targetKg) * 100)}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{goal.currentKg} of {goal.targetKg} kgCO2e by {new Date(goal.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Weekly challenges</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf"
                onClick={() => toggleChallenge(challenge.id)}
              >
                <p className="text-sm font-semibold capitalize text-slate-500">{challenge.category}</p>
                <h3 className="mt-1 font-black">{challenge.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{challenge.points} points · {challenge.completed ? 'complete' : 'open'}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card className="self-start">
        <h2 className="text-xl font-black">Create goal</h2>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            addGoal({ title, category, targetKg, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
            setTitle('');
          }}
        >
          <Field label="Goal title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <SelectField label="Category" value={category} onChange={(event) => setCategory(event.target.value as CarbonCategory)} options={[
            { value: 'transport', label: 'Transport' },
            { value: 'energy', label: 'Energy' },
            { value: 'food', label: 'Food' },
            { value: 'shopping', label: 'Shopping' },
            { value: 'water', label: 'Water' }
          ]} />
          <Field label="Target reduction" type="number" suffix="kg" value={targetKg} onChange={(event) => setTargetKg(Number(event.target.value))} />
          <Button type="submit" icon={<Plus size={18} />}>Add goal</Button>
        </form>
      </Card>
    </div>
  );
}
