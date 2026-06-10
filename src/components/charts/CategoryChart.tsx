import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryResult } from '@/types/carbon';

const colors = ['#0f766e', '#d97706', '#2563eb', '#be185d', '#5c7c2f'];

export function CategoryChart({ categories }: { categories: CategoryResult[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <div className="h-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={categories} dataKey="kgCO2e" nameKey="label" innerRadius={58} outerRadius={92}>
              {categories.map((entry, index) => (
                <Cell key={entry.category} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} kg`, 'kgCO2e']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid content-center gap-2">
        {categories.map((entry, index) => (
          <div key={entry.category} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="h-3 w-3 rounded-full" style={{ background: colors[index % colors.length] }} />
              {entry.label}
            </span>
            <span className="font-semibold text-ink">{Math.round(entry.kgCO2e)} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}
