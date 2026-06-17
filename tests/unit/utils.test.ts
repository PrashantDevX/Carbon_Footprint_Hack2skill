import { describe, it, expect } from 'vitest';
import { cn, formatKg, percent, uid, isoDaysFromNow, MS_PER_DAY } from '@/lib/utils';

describe('utils', () => {
  it('cn merges and dedupes Tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });

  it('formatKg rounds and appends the unit', () => {
    expect(formatKg(1234.6)).toBe('1,235 kg');
    expect(formatKg(0)).toBe('0 kg');
  });

  it('percent rounds to a whole-number percentage', () => {
    expect(percent(42.4)).toBe('42%');
  });

  it('uid produces unique, prefixed ids', () => {
    const a = uid('goal');
    const b = uid('goal');
    expect(a.startsWith('goal-')).toBe(true);
    expect(a).not.toBe(b);
  });

  it('isoDaysFromNow returns a valid ISO date offset by the given days', () => {
    const future = new Date(isoDaysFromNow(10)).getTime();
    const past = new Date(isoDaysFromNow(-10)).getTime();
    expect(future - past).toBeCloseTo(20 * MS_PER_DAY, -3);
    expect(future).toBeGreaterThan(Date.now());
    expect(past).toBeLessThan(Date.now());
  });
});
