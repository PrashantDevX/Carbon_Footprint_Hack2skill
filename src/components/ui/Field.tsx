import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
}

export function Field({ label, suffix, id, ...props }: FieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor={fieldId}>
      <span>{label}</span>
      <span className="flex overflow-hidden rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-leaf">
        <input
          id={fieldId}
          className="min-h-11 w-full border-0 px-3 text-base outline-none"
          {...props}
        />
        {suffix ? <span className="grid min-w-12 place-items-center bg-slate-100 px-2 text-xs text-slate-600">{suffix}</span> : null}
      </span>
    </label>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, id, options, ...props }: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor={fieldId}>
      <span>{label}</span>
      <select
        id={fieldId}
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:ring-2 focus:ring-leaf"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
