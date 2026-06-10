import type { CarbonCategory, DietType } from '@/types/carbon';

export const categoryLabels: Record<CarbonCategory, string> = {
  transport: 'Transport',
  energy: 'Home energy',
  food: 'Food',
  shopping: 'Shopping',
  water: 'Water'
};

export const vehicleFactors = {
  petrol: 0.192,
  diesel: 0.171,
  hybrid: 0.105,
  electric: 0.053
};

export const transportFactors = {
  bus: 0.089,
  train: 0.041,
  flightHour: 92
};

export const gridFactors = {
  india: { kgPerKwh: 0.708, monthlyAverage: 1600 },
  us: { kgPerKwh: 0.386, monthlyAverage: 1300 },
  uk: { kgPerKwh: 0.233, monthlyAverage: 750 },
  eu: { kgPerKwh: 0.275, monthlyAverage: 780 },
  global: { kgPerKwh: 0.475, monthlyAverage: 950 }
};

export const dietDailyFactors: Record<DietType, number> = {
  vegan: 2.9,
  vegetarian: 3.8,
  mixed: 5.4,
  'meat-heavy': 7.2
};

export const spendFactors = {
  clothing: 0.42,
  electronics: 0.62,
  household: 0.28
};

export const categoryTips: Record<CarbonCategory, string[]> = {
  transport: [
    'Batch errands into one trip and replace short car trips with walking or cycling.',
    'Use public transport twice a week to cut transport emissions quickly.'
  ],
  energy: [
    'Shift heavy appliance use to daylight hours if solar or cleaner grid supply is available.',
    'Set cooling one degree warmer and seal obvious air leaks.'
  ],
  food: [
    'Plan two plant-forward dinners per week and use leftovers before buying more.',
    'Buy seasonal local produce where practical.'
  ],
  shopping: [
    'Try a 48-hour pause before non-essential purchases.',
    'Choose repair, rental, refurbished, or second-hand options first.'
  ],
  water: [
    'Use shorter showers and full laundry loads.',
    'Replace bottled water with a refillable bottle where drinking water is safe.'
  ]
};
