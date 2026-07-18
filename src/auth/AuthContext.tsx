import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Coach } from '../types';
import { api, ApiError } from '../api';

type Phase = 'loading' | 'signed-out' | 'signed-in';

interface AuthContextValue {
  phase: Phase;
  coach: Coach | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(input: { name: string; email: string; password: string }): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    let cancelled = false;
    api.auth.currentCoach().then((c) => {
      if (cancelled) return;
      setCoach(c);
      setPhase(c ? 'signed-in' : 'signed-out');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const c = await api.auth.signIn(email, password);
    setCoach(c);
    setPhase('signed-in');
  }, []);

  const signUp = useCallback(async (input: { name: string; email: string; password: string }) => {
    const c = await api.auth.signUp(input);
    setCoach(c);
    setPhase('signed-in');
  }, []);

  const signOut = useCallback(async () => {
    await api.auth.signOut();
    setCoach(null);
    setPhase('signed-out');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ phase, coach, signIn, signUp, signOut }),
    [phase, coach, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ApiError };
