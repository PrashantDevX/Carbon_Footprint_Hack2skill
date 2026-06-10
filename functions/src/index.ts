import { initializeApp } from 'firebase-admin/app';
import { carbonAssistant } from './ai/carbonAssistant.js';
import { scanReceipt } from './vision/receiptScanner.js';
import { weeklyReports } from './scheduled/weeklyReports.js';
import { updateLeaderboard } from './scheduled/leaderboardUpdate.js';
import { goalCompleted } from './triggers/goalCompleted.js';

initializeApp();

export { carbonAssistant, scanReceipt, weeklyReports, updateLeaderboard, goalCompleted };
