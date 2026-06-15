import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { defaultProfile } from '@/lib/defaultData';
import type { UserProfile } from '@/types/user';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Translate raw Firebase auth error codes into friendly, actionable messages.
 * Keeps cryptic SDK strings out of the UI while still surfacing the real cause.
 */
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as AuthError)?.code ?? '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Redirecting you instead…';
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return 'This sign-in method is not enabled. Please contact the site owner.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorised for sign-in. Add it in Firebase Auth settings.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return (error as Error)?.message || 'Something went wrong while signing in.';
  }
}

/** Resolve (or lazily create) the Firestore profile for an authenticated user. */
async function resolveProfile(firebaseUser: User): Promise<UserProfile> {
  // Build a profile that never contains `undefined` values — Firestore rejects them.
  const isAnonymous = firebaseUser.isAnonymous;
  const baseProfile: UserProfile = {
    ...defaultProfile,
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || (isAnonymous ? 'Eco Guest' : 'Eco Explorer'),
    createdAt: new Date().toISOString()
  };

  // Only attach optional fields when they actually have a value.
  if (firebaseUser.email) baseProfile.email = firebaseUser.email;
  else delete baseProfile.email;
  if (firebaseUser.photoURL) baseProfile.photoURL = firebaseUser.photoURL;
  else delete baseProfile.photoURL;

  if (!db) {
    return baseProfile;
  }

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  // Strip any remaining undefined values defensively before writing.
  const sanitised = Object.fromEntries(
    Object.entries(baseProfile).filter(([, value]) => value !== undefined)
  );

  await setDoc(userRef, { ...sanitised, createdAt: serverTimestamp() });
  return baseProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Complete any pending redirect-based sign-in (popup fallback path).
    getRedirectResult(auth).catch((error) => {
      console.warn('Redirect sign-in could not be completed:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          setUser(await resolveProfile(firebaseUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialised. Check your environment configuration.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const code = (error as AuthError)?.code ?? '';
      // Popups are often blocked on hosted/mobile browsers — fall back to redirect.
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw error;
    }
  };

  const signInAnonymously = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialised. Check your environment configuration.');
    await firebaseSignInAnonymously(auth);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !db) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, updates, { merge: true });
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
