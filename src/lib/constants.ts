/** Shared application constants — centralised to avoid magic numbers in components. */

/** Maximum number of assistant messages a guest (anonymous) user may send. */
export const GUEST_MESSAGE_LIMIT = 3;

/** Maximum chat sessions kept in history before the oldest is pruned. */
export const MAX_CHAT_SESSIONS = 20;

/** Default goal horizon, in days, when a goal is created from an insight. */
export const GOAL_HORIZON_DAYS = 30;

/** Maximum receipt image upload size, in bytes (8 MB). */
export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;

/** localStorage key for the persisted colour theme. */
export const THEME_STORAGE_KEY = 'ecotrack-theme';

/** Shared dropdown option lists, reused across the Calculator and Settings forms. */
export const DIET_OPTIONS = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'meat-heavy', label: 'Meat-heavy' }
] as const;

export const VEHICLE_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' }
] as const;

export const GRID_OPTIONS = [
  { value: 'india', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'European Union' },
  { value: 'global', label: 'Global average' }
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' }
] as const;
