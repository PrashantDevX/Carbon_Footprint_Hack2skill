import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

export const weeklyReports = onSchedule('every monday 09:00', async () => {
  const db = getFirestore();
  await db.collection('systemJobs').add({
    type: 'weeklyReports',
    status: 'queued',
    createdAt: new Date().toISOString()
  });
});
