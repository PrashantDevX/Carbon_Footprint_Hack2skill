import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

export const goalCompleted = onDocumentUpdated('users/{userId}/goals/{goalId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.completed || !after.completed) return;

  await getFirestore()
    .doc(`users/${event.params.userId}`)
    .set(
      {
        points: FieldValue.increment(100),
        badges: FieldValue.arrayUnion('Goal Finisher')
      },
      { merge: true }
    );
});
