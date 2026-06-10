import type { CarbonInput, Challenge, Goal } from '@/types/carbon';
import type { LeaderboardUser, UserProfile } from '@/types/user';

export const defaultInput: CarbonInput = {
  transport: {
    carKm: 240,
    busKm: 60,
    trainKm: 30,
    flightHours: 0,
    vehicleType: 'petrol'
  },
  energy: {
    electricityKwh: 180,
    gasTherms: 12,
    renewablePercent: 10,
    country: 'india'
  },
  food: {
    dietType: 'mixed',
    mealsPerDay: 3,
    foodWastePercent: 15,
    localFoodPercent: 25
  },
  shopping: {
    clothingSpend: 2500,
    electronicsSpend: 1500,
    householdSpend: 1200,
    secondHandPercent: 10
  },
  water: {
    showersPerWeek: 7,
    laundryLoads: 5,
    bottledWaterLiters: 8
  }
};

export const defaultProfile: UserProfile = {
  uid: 'demo-user',
  displayName: 'Eco Builder',
  email: 'demo@ecotrack.local',
  location: 'India',
  householdSize: 3,
  dietType: 'mixed',
  vehicleType: 'petrol',
  points: 860,
  badges: ['Baseline Built', 'Energy Saver', 'Waste Watcher'],
  preferredLanguage: 'en',
  notificationsEnabled: false
};

export const defaultGoals: Goal[] = [
  {
    id: 'goal-energy',
    title: 'Cut home energy by 12%',
    category: 'energy',
    targetKg: 35,
    currentKg: 18,
    dueDate: '2026-07-15',
    completed: false
  },
  {
    id: 'goal-food',
    title: 'Two low-carbon meal days weekly',
    category: 'food',
    targetKg: 22,
    currentKg: 22,
    dueDate: '2026-06-30',
    completed: true
  }
];

export const defaultChallenges: Challenge[] = [
  {
    id: 'bike-week',
    title: 'Replace 20 km of car travel',
    category: 'transport',
    points: 120,
    completed: false
  },
  {
    id: 'repair-first',
    title: 'Repair or reuse one item',
    category: 'shopping',
    points: 90,
    completed: true
  },
  {
    id: 'no-bottle',
    title: 'Skip bottled water this week',
    category: 'water',
    points: 60,
    completed: false
  }
];

export const leaderboard: LeaderboardUser[] = [
  { uid: 'a', displayName: 'Asha', monthlyKgCO2e: 412, points: 1440, badge: 'Planet Pro' },
  { uid: 'b', displayName: 'Rohan', monthlyKgCO2e: 486, points: 1210, badge: 'Transit Hero' },
  { uid: 'demo-user', displayName: 'Eco Builder', monthlyKgCO2e: 528, points: 860, badge: 'Rising' },
  { uid: 'd', displayName: 'Mira', monthlyKgCO2e: 611, points: 720, badge: 'Starter' }
];
