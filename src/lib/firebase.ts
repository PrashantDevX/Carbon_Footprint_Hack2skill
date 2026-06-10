import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const app: FirebaseApp | undefined = hasFirebaseConfig ? initializeApp(firebaseConfig) : undefined;
export const auth: Auth | undefined = app ? getAuth(app) : undefined;
export const db: Firestore | undefined = app
  ? initializeFirestore(app, { localCache: persistentLocalCache() })
  : undefined;
export const storage: FirebaseStorage | undefined = app ? getStorage(app) : undefined;
export const functions: Functions | undefined = app ? getFunctions(app) : undefined;
export const perf: FirebasePerformance | undefined = app ? getPerformance(app) : undefined;

export let analytics: Analytics | undefined;
if (app) {
  void isSupported().then((supported: boolean) => {
    if (supported && app) analytics = getAnalytics(app);
  });
}

export function firebaseReady() {
  return hasFirebaseConfig;
}
