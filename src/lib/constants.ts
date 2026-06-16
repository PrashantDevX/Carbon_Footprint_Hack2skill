/** Shared application constants — centralised to avoid magic numbers in components. */

/** Maximum number of assistant messages a guest (anonymous) user may send. */
export const GUEST_MESSAGE_LIMIT = 3;

/** Maximum chat sessions kept in history before the oldest is pruned. */
export const MAX_CHAT_SESSIONS = 20;

/** Default goal horizon, in days, when a goal is created from an insight. */
export const GOAL_HORIZON_DAYS = 30;

/** Maximum receipt image upload size, in bytes (8 MB). */
export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;
