interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

/** A friendly, accessible slider with a live value badge — easier than raw number entry. */
export function RangeField({ label, value, min, max, step = 1, suffix, onChange }: RangeFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="rounded-lg bg-forest-50 px-2.5 py-0.5 text-sm font-bold text-forest-700 dark:bg-forest-900/40 dark:text-forest-300 tabular-nums">
          {value.toLocaleString()}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-forest-600 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, rgb(22 163 74) ${pct}%, rgb(229 231 235) ${pct}%)`
        }}
        aria-valuetext={`${value}${suffix ? ` ${suffix}` : ''}`}
      />
    </div>
  );
}
