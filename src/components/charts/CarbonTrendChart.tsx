import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CarbonLog } from '@/types/carbon';

export function CarbonTrendChart({ logs }: { logs: CarbonLog[] }) {
  const data = [...logs]
    .reverse()
    .map((log, index) => ({
      name: new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      kg: log.result.monthlyKgCO2e,
      target: Math.max(350, log.result.monthlyKgCO2e - 40 - index * 12)
    }));

  return (
    <div className="h-72 w-full" aria-label="Carbon trend chart">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="carbonFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e2df" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={42} />
          <Tooltip formatter={(value) => [`${value} kg`, 'Monthly footprint']} />
          <Area type="monotone" dataKey="kg" stroke="#0f766e" fill="url(#carbonFill)" strokeWidth={3} />
          <Area type="monotone" dataKey="target" stroke="#d97706" fill="transparent" strokeDasharray="4 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
