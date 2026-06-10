import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { defaultProfile } from '@/lib/defaultData';
import type { UserProfile } from '@/types/user';

interface AuthContextValue {
  user: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  signInAnonymously: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ecotrack-profile');
    return saved ? (JSON.parse(saved) as UserProfile) : defaultProfile;
  });

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((current) => {
      const next = { ...current, ...profile };
      localStorage.setItem('ecotrack-profile', JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      updateProfile,
      signInAnonymously: () => updateProfile({ uid: 'anonymous-demo', displayName: 'Guest Explorer' }),
      signOut: () => updateProfile(defaultProfile)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
