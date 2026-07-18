import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ApiError } from '../../api';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { AuthFrame } from './AuthFrame';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      const from = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFrame
      title="Sign in"
      subtitle="Sports Dashboard for coaches"
      footer={
        <>
          New here? <Link to="/sign-up">Create an account</Link>
        </>
      }
    >
      <form className="uplate-auth__form" onSubmit={onSubmit}>
        {error && (
          <p className="uplate-auth__error" role="alert">
            {error}
          </p>
        )}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu"
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <p style={{ fontSize: 'var(--type-meta)', color: 'var(--ink-3)' }}>
          Demo accounts: jordan@uplate.dev or casey@uplate.dev, password coachdemo
        </p>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthFrame>
  );
}
