import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
}

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-leaf focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-leaf text-white hover:bg-teal-800',
        variant === 'secondary' && 'border border-slate-300 bg-white text-ink hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-700 hover:bg-slate-100',
        variant === 'danger' && 'bg-rose-700 text-white hover:bg-rose-800',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
