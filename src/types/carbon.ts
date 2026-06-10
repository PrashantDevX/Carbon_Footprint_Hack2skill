export type CarbonCategory = 'transport' | 'energy' | 'food' | 'shopping' | 'water';

export type DietType = 'vegan' | 'vegetarian' | 'mixed' | 'meat-heavy';

export interface TransportInput {
  carKm: number;
  busKm: number;
  trainKm: number;
  flightHours: number;
  vehicleType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
}

export interface EnergyInput {
  electricityKwh: number;
  gasTherms: number;
  renewablePercent: number;
  country: 'india' | 'us' | 'uk' | 'eu' | 'global';
}

export interface FoodInput {
  dietType: DietType;
  mealsPerDay: number;
  foodWastePercent: number;
  localFoodPercent: number;
}

export interface ShoppingInput {
  clothingSpend: number;
  electronicsSpend: number;
  householdSpend: number;
  secondHandPercent: number;
}

export interface WaterInput {
  showersPerWeek: number;
  laundryLoads: number;
  bottledWaterLiters: number;
}

export interface CarbonInput {
  transport: TransportInput;
  energy: EnergyInput;
  food: FoodInput;
  shopping: ShoppingInput;
  water: WaterInput;
}

export interface CategoryResult {
  category: CarbonCategory;
  kgCO2e: number;
  label: string;
  tips: string[];
}

export interface CarbonResult {
  monthlyKgCO2e: number;
  annualKgCO2e: number;
  score: number;
  categories: CategoryResult[];
  topCategory: CategoryResult;
  comparison: {
    globalMonthlyAverage: number;
    nationalMonthlyAverage: number;
    percentVsGlobal: number;
  };
}

export interface CarbonLog {
  id: string;
  createdAt: string;
  input: CarbonInput;
  result: CarbonResult;
}

export interface Goal {
  id: string;
  title: string;
  category: CarbonCategory;
  targetKg: number;
  currentKg: number;
  dueDate: string;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  category: CarbonCategory;
  points: number;
  completed: boolean;
}

export interface ReceiptItem {
  name: string;
  price: number;
  category: 'groceries' | 'clothing' | 'electronics' | 'household' | 'unknown';
  estimatedKgCO2e: number;
}
