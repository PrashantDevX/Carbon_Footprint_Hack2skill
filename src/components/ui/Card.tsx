import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white p-5 shadow-lg shadow-forest-900/5',
        'dark:border-gray-700/50 dark:bg-gray-800/80 dark:shadow-black/20',
        className
      )}
      {...props}
    />
  );
}
