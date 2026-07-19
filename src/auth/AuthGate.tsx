import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { DEMO_COACH } from './demo';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

const AUTH_ROUTES = new Set(['/sign-in', '/sign-up']);
const DEMO_ROUTE = '/demo';

function AuthPending() {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', alignItems: 'center', justifyContent: 'center' }}>
      <span className="sr-only">Loading</span>
    </div>
  );
}

/**
 * `/demo` signs into the seeded coach account and drops straight onto the
 * roster, so the dashboard can be linked without handing out credentials.
 *
 * An existing session is left alone: someone already signed in just lands on
 * the roster rather than being silently swapped into another account.
 */
function DemoEntry() {
  const { phase, signIn } = useAuth();
  const [failed, setFailed] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (phase !== 'signed-out' || attempted.current) return;
    attempted.current = true;
    signIn(DEMO_COACH.email, DEMO_COACH.password).catch(() => setFailed(true));
  }, [phase, signIn]);

  if (phase === 'signed-in') return <Navigate to="/" replace />;
  // Fall back to the normal form rather than stranding anyone on a blank page.
  if (failed) return <Navigate to="/sign-in" replace />;
  return <AuthPending />;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { phase } = useAuth();
  const location = useLocation();

  // Ahead of the phase checks: /demo has to work both signed-out (sign in,
  // then redirect) and signed-in (redirect only).
  if (location.pathname === DEMO_ROUTE) {
    return <DemoEntry />;
  }

  if (phase === 'loading') {
    return <AuthPending />;
  }

  if (phase !== 'signed-in') {
    const fromPath = AUTH_ROUTES.has(location.pathname) ? undefined : location.pathname;
    return (
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/sign-in" replace state={fromPath ? { from: fromPath } : undefined} />} />
      </Routes>
    );
  }

  return <>{children}</>;
}
