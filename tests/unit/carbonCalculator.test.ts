import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { defaultInput } from '@/lib/defaultData';

describe('carbonCalculator', () => {
  describe('calculateCarbonFootprint', () => {
    it('calculates a valid carbon result for default input', () => {
      const result = calculateCarbonFootprint(defaultInput);
      expect(result.monthlyKgCO2e).toBeGreaterThan(0);
      expect(result.annualKgCO2e).toEqual(result.monthlyKgCO2e * 12);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.categories.length).toBe(5);
    });

    it('correctly identifies the top category', () => {
      const input = { ...defaultInput };
      // Massively increase flight hours to ensure transport is top category
      input.transport = { ...input.transport, flightHours: 100 };
      const result = calculateCarbonFootprint(input);
      expect(result.topCategory.category).toBe('transport');
    });

    it('handles zero inputs gracefully', () => {
      const zeroInput = {
        transport: { carKm: 0, busKm: 0, trainKm: 0, flightHours: 0, vehicleType: 'petrol' as const },
        energy: { electricityKwh: 0, gasTherms: 0, renewablePercent: 0, country: 'us' as const },
        food: { dietType: 'vegan' as const, mealsPerDay: 0, foodWastePercent: 0, localFoodPercent: 0 },
        shopping: { clothingSpend: 0, electronicsSpend: 0, householdSpend: 0, secondHandPercent: 0 },
        water: { showersPerWeek: 0, laundryLoads: 0, bottledWaterLiters: 0 }
      };
      const result = calculateCarbonFootprint(zeroInput);
      expect(result.monthlyKgCO2e).toBe(0);
    });
  });
});
