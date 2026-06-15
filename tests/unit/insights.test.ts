import { describe, it, expect } from 'vitest';
import { generateInsights, totalPotentialSaving } from '@/lib/insights';
import { calculateCarbonFootprint } from '@/lib/carbonCalculator';
import { defaultInput } from '@/lib/defaultData';
import type { CarbonInput } from '@/types/carbon';

describe('insights engine', () => {
  it('generates ranked insights for a typical profile', () => {
    const result = calculateCarbonFootprint(defaultInput);
    const insights = generateInsights(defaultInput, result);

    expect(insights.length).toBeGreaterThan(0);
    // Insights must be sorted by descending priority.
    for (let i = 1; i < insights.length; i++) {
      expect(insights[i - 1].priority).toBeGreaterThanOrEqual(insights[i].priority);
    }
  });

  it('does not recommend transport shift for an EV-only, low-mileage user', () => {
    const input: CarbonInput = {
      ...defaultInput,
      transport: { carKm: 20, busKm: 0, trainKm: 0, flightHours: 0, vehicleType: 'electric' }
    };
    const result = calculateCarbonFootprint(input);
    const insights = generateInsights(input, result);
    expect(insights.find((i) => i.id === 'transport-shift')).toBeUndefined();
  });

  it('recommends reducing flights only when the user flies', () => {
    const noFlights = { ...defaultInput, transport: { ...defaultInput.transport, flightHours: 0 } };
    const withFlights = { ...defaultInput, transport: { ...defaultInput.transport, flightHours: 10 } };

    const a = generateInsights(noFlights, calculateCarbonFootprint(noFlights));
    const b = generateInsights(withFlights, calculateCarbonFootprint(withFlights));

    expect(a.find((i) => i.id === 'transport-flights')).toBeUndefined();
    expect(b.find((i) => i.id === 'transport-flights')).toBeDefined();
  });

  it('returns non-negative total potential savings', () => {
    const result = calculateCarbonFootprint(defaultInput);
    const insights = generateInsights(defaultInput, result);
    expect(totalPotentialSaving(insights)).toBeGreaterThanOrEqual(0);
  });

  it('produces few or no insights for an already-green profile', () => {
    const green: CarbonInput = {
      transport: { carKm: 0, busKm: 0, trainKm: 0, flightHours: 0, vehicleType: 'electric' },
      energy: { electricityKwh: 50, gasTherms: 0, renewablePercent: 100, country: 'eu' },
      food: { dietType: 'vegan', mealsPerDay: 3, foodWastePercent: 0, localFoodPercent: 80 },
      shopping: { clothingSpend: 0, electronicsSpend: 0, householdSpend: 0, secondHandPercent: 100 },
      water: { showersPerWeek: 5, laundryLoads: 2, bottledWaterLiters: 0 }
    };
    const insights = generateInsights(green, calculateCarbonFootprint(green));
    expect(insights.length).toBeLessThanOrEqual(1);
  });
});
