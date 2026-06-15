import type { CarbonInput, CarbonResult, CarbonCategory } from '@/types/carbon';

export interface EcoInsight {
  id: string;
  category: CarbonCategory;
  title: string;
  description: string;
  /** Estimated monthly kgCO2e a user could save by acting on this insight. */
  potentialMonthlySaving: number;
  /** Effort to adopt — drives the suggested order alongside impact. */
  effort: 'easy' | 'moderate' | 'ambitious';
  priority: number;
}

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Derives prioritized, quantified recommendations from a user's carbon profile.
 *
 * This is the "logical decision making based on user context" layer: instead of
 * generic tips, each insight is generated only when the user's *actual* inputs
 * indicate a meaningful, reducible source of emissions — and is ranked by the
 * estimated CO2e it could save.
 */
export function generateInsights(input: CarbonInput, result: CarbonResult): EcoInsight[] {
  const insights: EcoInsight[] = [];
  const byCategory = Object.fromEntries(result.categories.map((c) => [c.category, c.kgCO2e])) as Record<
    CarbonCategory,
    number
  >;

  // --- Transport ----------------------------------------------------------
  if (input.transport.carKm > 100 && input.transport.vehicleType !== 'electric') {
    const saving = round(byCategory.transport * 0.25);
    insights.push({
      id: 'transport-shift',
      category: 'transport',
      title: 'Shift short car trips to transit or cycling',
      description: `You log ${input.transport.carKm} km/month by car. Replacing a quarter of that with public transport, cycling, or walking is one of the fastest ways to cut emissions.`,
      potentialMonthlySaving: saving,
      effort: 'moderate',
      priority: 0
    });
  }
  if (input.transport.flightHours > 0) {
    insights.push({
      id: 'transport-flights',
      category: 'transport',
      title: 'Offset or reduce air travel',
      description: 'Flights are carbon-intensive per hour. Consider rail for short trips or carbon offsets for unavoidable flights.',
      potentialMonthlySaving: round(input.transport.flightHours * 90 * 1.9 * 0.3),
      effort: 'ambitious',
      priority: 0
    });
  }

  // --- Energy -------------------------------------------------------------
  if (input.energy.renewablePercent < 50 && byCategory.energy > 50) {
    const saving = round(byCategory.energy * ((50 - input.energy.renewablePercent) / 100) * 0.5);
    insights.push({
      id: 'energy-renewable',
      category: 'energy',
      title: 'Increase your renewable energy share',
      description: `Only ${input.energy.renewablePercent}% of your energy is renewable. Switching to a green tariff or adding solar could noticeably lower your home emissions.`,
      potentialMonthlySaving: Math.max(5, saving),
      effort: 'moderate',
      priority: 0
    });
  }
  if (input.energy.electricityKwh > 250) {
    insights.push({
      id: 'energy-efficiency',
      category: 'energy',
      title: 'Trim standby and heating/cooling load',
      description: `Your ${input.energy.electricityKwh} kWh/month is above average. LED lighting, a smart thermostat, and turning off standby devices can cut 10–15%.`,
      potentialMonthlySaving: round(byCategory.energy * 0.12),
      effort: 'easy',
      priority: 0
    });
  }

  // --- Food ---------------------------------------------------------------
  if (input.food.dietType === 'meat-heavy' || input.food.dietType === 'mixed') {
    const saving = round(byCategory.food * (input.food.dietType === 'meat-heavy' ? 0.3 : 0.18));
    insights.push({
      id: 'food-diet',
      category: 'food',
      title: 'Add a few plant-based meals each week',
      description: 'Swapping just 2–3 meat meals a week for plant-based options measurably reduces your food footprint without a full diet change.',
      potentialMonthlySaving: saving,
      effort: 'easy',
      priority: 0
    });
  }
  if (input.food.foodWastePercent > 10) {
    insights.push({
      id: 'food-waste',
      category: 'food',
      title: 'Cut food waste with smarter planning',
      description: `Around ${input.food.foodWastePercent}% of your food is wasted. Meal planning and using leftovers can recover most of that wasted carbon.`,
      potentialMonthlySaving: round(byCategory.food * (input.food.foodWastePercent / 100) * 0.6),
      effort: 'easy',
      priority: 0
    });
  }

  // --- Shopping -----------------------------------------------------------
  if (input.shopping.secondHandPercent < 30 && byCategory.shopping > 30) {
    insights.push({
      id: 'shopping-secondhand',
      category: 'shopping',
      title: 'Buy more second-hand and repair first',
      description: 'Choosing refurbished electronics and second-hand clothing avoids the large embedded carbon of new manufacturing.',
      potentialMonthlySaving: round(byCategory.shopping * 0.2),
      effort: 'moderate',
      priority: 0
    });
  }

  // --- Water --------------------------------------------------------------
  if (input.water.bottledWaterLiters > 2) {
    insights.push({
      id: 'water-bottled',
      category: 'water',
      title: 'Switch from bottled to filtered tap water',
      description: 'Bottled water carries packaging and transport emissions. A reusable bottle and filter removes almost all of it.',
      potentialMonthlySaving: round(input.water.bottledWaterLiters * 0.18 * 0.9),
      effort: 'easy',
      priority: 0
    });
  }

  // Rank by impact (descending), with a light effort tie-breaker.
  const effortWeight = { easy: 0, moderate: 1, ambitious: 2 };
  return insights
    .map((insight) => ({
      ...insight,
      priority: insight.potentialMonthlySaving - effortWeight[insight.effort] * 2
    }))
    .sort((a, b) => b.priority - a.priority);
}

/** Sum of potential monthly savings across all current insights. */
export function totalPotentialSaving(insights: EcoInsight[]): number {
  return round(insights.reduce((sum, insight) => sum + insight.potentialMonthlySaving, 0));
}
