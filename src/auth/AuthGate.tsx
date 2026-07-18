import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

const AUTH_ROUTES = new Set(['/sign-in', '/sign-up']);

export function AuthGate({ children }: { children: ReactNode }) {
  const { phase } = useAuth();
  const location = useLocation();

  if (phase === 'loading') {
    return (
      <div style={{ display: 'flex', minHeight: '100dvh', alignItems: 'center', justifyContent: 'center' }}>
        <span className="sr-only">Loading</span>
      </div>
    );
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
