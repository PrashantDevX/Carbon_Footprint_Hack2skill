import type { DietType } from './carbon';

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  location: string;
  householdSize: number;
  dietType: DietType;
  vehicleType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  points: number;
  badges: string[];
  preferredLanguage: 'en' | 'hi' | 'es';
  notificationsEnabled: boolean;
}

export interface LeaderboardUser {
  uid: string;
  displayName: string;
  monthlyKgCO2e: number;
  points: number;
  badge: string;
}
