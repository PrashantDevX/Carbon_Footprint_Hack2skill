import { Medal, Crown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { leaderboard } from '@/lib/defaultData';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const rankAccent = ['text-amber-500', 'text-gray-400', 'text-amber-700'];

export function Leaderboard() {
  const { user } = useAuth();
  const ranked = leaderboard
    .slice()
    .sort((a, b) => a.monthlyKgCO2e - b.monthlyKgCO2e || b.points - a.points);

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
          <Medal aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Community Leaderboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ranked by lowest monthly footprint, then points.</p>
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 0, 2].map((podiumIndex) => {
          const member = ranked[podiumIndex];
          if (!member) return <div key={podiumIndex} />;
          const heights = ['mt-6', 'mt-0', 'mt-10'];
          return (
            <Card key={member.uid} className={cn('flex flex-col items-center text-center', heights[podiumIndex])}>
              {podiumIndex === 0 && <Crown className="mb-1 h-6 w-6 text-amber-500" aria-hidden="true" />}
              <span className={cn('text-3xl font-black', rankAccent[podiumIndex])}>#{podiumIndex + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-forest-400 to-forest-600 text-lg font-black text-white">
                {member.displayName.slice(0, 1)}
              </span>
              <p className="mt-2 font-bold text-gray-900 dark:text-white">{member.displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{member.badge}</p>
              <p className="mt-1 text-sm font-semibold text-forest-600 dark:text-forest-400">{member.monthlyKgCO2e} kg/mo</p>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
            <tr>
              <th className="p-3 font-semibold">Rank</th>
              <th className="p-3 font-semibold">Member</th>
              <th className="hidden p-3 font-semibold sm:table-cell">Badge</th>
              <th className="p-3 text-right font-semibold">kg CO₂e/mo</th>
              <th className="p-3 text-right font-semibold">Points</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((member, index) => {
              const isYou = user?.displayName === member.displayName;
              return (
                <tr
                  key={member.uid}
                  className={cn(
                    'border-t border-gray-100 dark:border-gray-700/60',
                    isYou && 'bg-forest-50 dark:bg-forest-900/20'
                  )}
                >
                  <td className="p-3 font-black text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                    {member.displayName}
                    {isYou && <span className="ml-2 rounded-full bg-forest-600 px-2 py-0.5 text-xs font-semibold text-white">You</span>}
                  </td>
                  <td className="hidden p-3 text-gray-600 dark:text-gray-400 sm:table-cell">{member.badge}</td>
                  <td className="p-3 text-right text-gray-900 dark:text-gray-100">{member.monthlyKgCO2e}</td>
                  <td className="p-3 text-right text-gray-900 dark:text-gray-100">{member.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
