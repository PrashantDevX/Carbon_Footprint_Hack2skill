import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
}

export function Field({ label, suffix, id, ...props }: FieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="grid gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={fieldId}>
      <span>{label}</span>
      <span className="flex overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-forest-500 dark:border-gray-600 dark:bg-gray-900">
        <input
          id={fieldId}
          className="min-h-11 w-full border-0 bg-transparent px-3 text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
          {...props}
        />
        {suffix ? (
          <span className="grid min-w-12 place-items-center bg-gray-100 px-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {suffix}
          </span>
        ) : null}
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
    <label className="grid gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={fieldId}>
      <span>{label}</span>
      <select
        id={fieldId}
        className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-base text-gray-900 outline-none focus:ring-2 focus:ring-forest-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
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
