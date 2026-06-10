import { describe, expect, it } from 'vitest';
import { calculateCarbonFootprint, estimateReceiptItemKg } from '@/lib/carbonCalculator';
import { defaultInput } from '@/lib/defaultData';

describe('calculateCarbonFootprint', () => {
  it('returns typed category totals and a bounded score', () => {
    const result = calculateCarbonFootprint(defaultInput);

    expect(result.monthlyKgCO2e).toBeGreaterThan(0);
    expect(result.categories).toHaveLength(5);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.topCategory.kgCO2e).toBe(Math.max(...result.categories.map((item) => item.kgCO2e)));
  });

  it('rewards renewable energy and second hand shopping', () => {
    const baseline = calculateCarbonFootprint(defaultInput);
    const improved = calculateCarbonFootprint({
      ...defaultInput,
      energy: { ...defaultInput.energy, renewablePercent: 80 },
      shopping: { ...defaultInput.shopping, secondHandPercent: 80 }
    });

    expect(improved.monthlyKgCO2e).toBeLessThan(baseline.monthlyKgCO2e);
  });

  it('estimates receipt item footprints', () => {
    expect(estimateReceiptItemKg('phone charger', 900)).toBeGreaterThan(
      estimateReceiptItemKg('lentils', 220)
    );
  });
});
