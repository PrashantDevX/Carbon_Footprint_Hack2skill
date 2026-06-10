import {
  categoryLabels,
  categoryTips,
  dietDailyFactors,
  gridFactors,
  spendFactors,
  transportFactors,
  vehicleFactors
} from './carbonFactors';
import type { CarbonCategory, CarbonInput, CarbonResult, CategoryResult } from '@/types/carbon';

const INR_TO_USD = 83;
const GLOBAL_MONTHLY_AVERAGE_KG = 950;

const round = (value: number) => Math.round(value * 10) / 10;

function category(category: CarbonCategory, kgCO2e: number): CategoryResult {
  return {
    category,
    kgCO2e: round(Math.max(0, kgCO2e)),
    label: categoryLabels[category],
    tips: categoryTips[category]
  };
}

/** Calculates monthly kgCO2e and scoring from user activity inputs. */
export function calculateCarbonFootprint(input: CarbonInput): CarbonResult {
  const transport =
    input.transport.carKm * vehicleFactors[input.transport.vehicleType] +
    input.transport.busKm * transportFactors.bus +
    input.transport.trainKm * transportFactors.train +
    input.transport.flightHours * transportFactors.flightHour * 1.9;

  const grid = gridFactors[input.energy.country];
  const renewableAdjustment = 1 - Math.min(input.energy.renewablePercent, 100) / 100;
  const energy =
    input.energy.electricityKwh * grid.kgPerKwh * renewableAdjustment +
    input.energy.gasTherms * 5.3;

  const wasteMultiplier = 1 + input.food.foodWastePercent / 100;
  const localReduction = 1 - Math.min(input.food.localFoodPercent, 80) / 500;
  const food =
    dietDailyFactors[input.food.dietType] *
    input.food.mealsPerDay /
    3 *
    30.4 *
    wasteMultiplier *
    localReduction;

  const secondHandReduction = 1 - Math.min(input.shopping.secondHandPercent, 100) / 100;
  const shopping =
    ((input.shopping.clothingSpend / INR_TO_USD) * spendFactors.clothing +
      (input.shopping.electronicsSpend / INR_TO_USD) * spendFactors.electronics +
      (input.shopping.householdSpend / INR_TO_USD) * spendFactors.household) *
    secondHandReduction;

  const water =
    input.water.showersPerWeek * 4 * 0.92 +
    input.water.laundryLoads * 4.2 +
    input.water.bottledWaterLiters * 0.18;

  const categories = [
    category('transport', transport),
    category('energy', energy),
    category('food', food),
    category('shopping', shopping),
    category('water', water)
  ];

  const monthlyKgCO2e = round(categories.reduce((sum, item) => sum + item.kgCO2e, 0));
  const nationalMonthlyAverage = grid.monthlyAverage;
  const score = Math.max(0, Math.min(100, Math.round(100 - (monthlyKgCO2e / nationalMonthlyAverage) * 65)));
  const topCategory = categories.reduce((top, item) => (item.kgCO2e > top.kgCO2e ? item : top));

  return {
    monthlyKgCO2e,
    annualKgCO2e: round(monthlyKgCO2e * 12),
    score,
    categories,
    topCategory,
    comparison: {
      globalMonthlyAverage: GLOBAL_MONTHLY_AVERAGE_KG,
      nationalMonthlyAverage,
      percentVsGlobal: round(((monthlyKgCO2e - GLOBAL_MONTHLY_AVERAGE_KG) / GLOBAL_MONTHLY_AVERAGE_KG) * 100)
    }
  };
}

export function estimateReceiptItemKg(name: string, price: number): number {
  const text = name.toLowerCase();
  const multiplier = text.includes('beef')
    ? 0.8
    : text.includes('phone') || text.includes('charger')
      ? 0.5
      : text.includes('shirt') || text.includes('jeans')
        ? 0.35
        : text.includes('milk') || text.includes('cheese')
          ? 0.22
          : 0.12;

  return round((price / INR_TO_USD) * multiplier);
}
