import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

export default function TeamCreate() {
  const { createTeam } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Give your team a name.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const team = await createTeam(trimmed);
      navigate('/', { replace: true, state: { openInviteForTeamId: team.id } });
    } catch {
      setError("Couldn't create the team. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="uplate-page-head">
        <h1 className="uplate-page-head__title">Create a team</h1>
      </div>
      <form className="uplate-card" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        {error && (
          <p className="uplate-auth__error" role="alert">
            {error}
          </p>
        )}
        <Field
          label="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Varsity Wrestling"
          autoFocus
        />
        <p style={{ fontSize: 'var(--type-meta)', color: 'var(--ink-3)' }}>
          You'll get a link to share with athletes right after this. They join with the UPlate app.
        </p>
        <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create team'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
