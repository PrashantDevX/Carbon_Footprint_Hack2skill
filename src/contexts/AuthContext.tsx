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

/** Strip undefined values — Firestore rejects them in writes. */
function sanitise(obj: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).filter(([, value]) => value !== undefined)
  );
}

/** The identity fields that should always reflect the live auth provider. */
function authIdentity(firebaseUser: User) {
  const isGuest = firebaseUser.isAnonymous;
  const identity: Partial<UserProfile> = {
    isGuest,
    displayName: firebaseUser.displayName || (isGuest ? 'Eco Guest' : 'Eco Explorer')
  };
  if (firebaseUser.email) identity.email = firebaseUser.email;
  if (firebaseUser.photoURL) identity.photoURL = firebaseUser.photoURL;
  return identity;
}

/**
 * Resolve (or lazily create) the Firestore profile for an authenticated user.
 *
 * Identity fields (name, email, photo, guest flag) are ALWAYS re-synced from the
 * live auth provider — so signing in with Google never shows a stale "Guest"
 * profile left over from a previous anonymous session or older app version.
 */
async function resolveProfile(firebaseUser: User): Promise<UserProfile> {
  const identity = authIdentity(firebaseUser);

  if (!db) {
    return { ...defaultProfile, uid: firebaseUser.uid, ...identity, createdAt: new Date().toISOString() };
  }

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existing = userSnap.data() as UserProfile;
    // Refresh identity on the stored doc so it matches the current provider.
    await setDoc(userRef, sanitise({ ...identity }), { merge: true });
    return { ...existing, ...identity };
  }

  const newProfile: UserProfile = {
    ...defaultProfile,
    uid: firebaseUser.uid,
    ...identity,
    createdAt: new Date().toISOString()
  };
  await setDoc(userRef, { ...sanitise(newProfile), createdAt: serverTimestamp() });
  return newProfile;
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
