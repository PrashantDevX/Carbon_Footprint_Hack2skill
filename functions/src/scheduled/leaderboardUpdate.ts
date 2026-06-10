import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

export const updateLeaderboard = onSchedule('every 24 hours', async () => {
  const db = getFirestore();
  const users = await db.collection('users').limit(100).get();
  const batch = db.batch();

  users.docs.forEach((doc) => {
    const data = doc.data();
    const ref = db.collection('leaderboard').doc(doc.id);
    batch.set(ref, {
      displayName: data.displayName ?? 'Eco member',
      monthlyKgCO2e: data.monthlyKgCO2e ?? 0,
      points: data.points ?? 0,
      updatedAt: new Date().toISOString()
    });
  });

  await batch.commit();
});
