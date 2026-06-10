import { Medal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { leaderboard } from '@/lib/defaultData';

export function Leaderboard() {
  return (
    <Card>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-100 text-clay">
          <Medal />
        </span>
        <div>
          <h1 className="text-2xl font-black">Community leaderboard</h1>
          <p className="text-sm text-slate-500">Ranked by lowest monthly footprint, then points</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-sm text-slate-600">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Member</th>
              <th className="p-3">Badge</th>
              <th className="p-3 text-right">Monthly kgCO2e</th>
              <th className="p-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard
              .slice()
              .sort((a, b) => a.monthlyKgCO2e - b.monthlyKgCO2e || b.points - a.points)
              .map((user, index) => (
                <tr key={user.uid} className="border-t border-slate-100">
                  <td className="p-3 font-black">{index + 1}</td>
                  <td className="p-3 font-semibold">{user.displayName}</td>
                  <td className="p-3 text-slate-600">{user.badge}</td>
                  <td className="p-3 text-right">{user.monthlyKgCO2e}</td>
                  <td className="p-3 text-right">{user.points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
