import { Medal, Crown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { leaderboard } from '@/lib/defaultData';
import { useAuth } from '@/contexts/AuthContext';
import { useCarbon } from '@/hooks/useCarbon';
import { cn } from '@/lib/utils';
import type { LeaderboardUser } from '@/types/user';

// Podium styling, indexed by finishing position (gold, silver, bronze).
const PODIUM_ACCENTS = ['text-amber-500', 'text-gray-400', 'text-amber-700'];
const PODIUM_OFFSETS = ['mt-6', 'mt-0', 'mt-10'];

export function Leaderboard() {
  const { user } = useAuth();
  const { result } = useCarbon();

  // Place the signed-in user on the board so their rank is meaningful.
  const me: LeaderboardUser | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || 'You',
        monthlyKgCO2e: Math.round(result.monthlyKgCO2e),
        points: user.points ?? 0,
        badge: user.badges?.[0] ?? 'Newcomer'
      }
    : null;

  const ranked = [...leaderboard, ...(me ? [me] : [])].sort(
    (a, b) => a.monthlyKgCO2e - b.monthlyKgCO2e || b.points - a.points
  );

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
          return (
            <Card key={member.uid} className={cn('flex flex-col items-center text-center', PODIUM_OFFSETS[podiumIndex])}>
              {podiumIndex === 0 && <Crown className="mb-1 h-6 w-6 text-amber-500" aria-hidden="true" />}
              <span className={cn('text-3xl font-black', PODIUM_ACCENTS[podiumIndex])}>#{podiumIndex + 1}</span>
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-900/50 dark:text-gray-400 sm:text-sm">
              <tr>
                <th className="p-2.5 font-semibold sm:p-3">Rank</th>
                <th className="p-2.5 font-semibold sm:p-3">Member</th>
                <th className="hidden p-2.5 font-semibold sm:table-cell sm:p-3">Badge</th>
                <th className="p-2.5 text-right font-semibold sm:p-3">kg CO₂e/mo</th>
                <th className="p-2.5 text-right font-semibold sm:p-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((member, index) => {
                const isYou = user?.uid === member.uid;
                return (
                  <tr
                    key={member.uid}
                    className={cn(
                      'border-t border-gray-100 text-sm dark:border-gray-700/60',
                      isYou && 'bg-forest-50 dark:bg-forest-900/20'
                    )}
                  >
                    <td className="p-2.5 font-black text-gray-900 dark:text-white sm:p-3">{index + 1}</td>
                    <td className="p-2.5 font-semibold text-gray-900 dark:text-gray-100 sm:p-3">
                      {member.displayName}
                      {isYou && <span className="ml-2 rounded-full bg-forest-600 px-2 py-0.5 text-xs font-semibold text-white">You</span>}
                    </td>
                    <td className="hidden p-2.5 text-gray-600 dark:text-gray-400 sm:table-cell sm:p-3">{member.badge}</td>
                    <td className="p-2.5 text-right text-gray-900 dark:text-gray-100 sm:p-3">{member.monthlyKgCO2e}</td>
                    <td className="p-2.5 text-right text-gray-900 dark:text-gray-100 sm:p-3">{member.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
