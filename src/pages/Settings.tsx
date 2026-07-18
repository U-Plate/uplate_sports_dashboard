import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useApp } from '../store/AppContext';
import type { Team } from '../types';
import { Button } from '../components/ui/Button';
import { InviteLinkPanel } from '../components/team/InviteLinkPanel';

export default function Settings() {
  const { coach, signOut } = useAuth();
  const { teams, loading } = useApp();
  const [inviteTeam, setInviteTeam] = useState<Team | null>(null);

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--s-8)' }}>
      <div className="uplate-page-head" style={{ paddingBottom: 0 }}>
        <h1 className="uplate-page-head__title">Settings</h1>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        <span className="uplate-zone__eyebrow">Coach profile</span>
        <div className="uplate-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--type-body)', fontWeight: 600, color: 'var(--ink)' }}>{coach?.name}</span>
            <span style={{ fontSize: 'var(--type-meta)', color: 'var(--ink-3)' }}>{coach?.email}</span>
          </div>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="uplate-zone__eyebrow">Your teams</span>
          <Link to="/teams/new" className="uplate-btn-ghost" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            New team
          </Link>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: 72 }} />
        ) : teams.length === 0 ? (
          <p style={{ fontSize: 'var(--type-body)', color: 'var(--ink-3)' }}>You haven't created a team yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            {teams.map((team) => (
              <div key={team.id} className="uplate-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s-4)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 'var(--type-body)', fontWeight: 600, color: 'var(--ink)' }}>{team.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--type-meta)', color: 'var(--ink-3)', marginTop: 2 }}>
                    <Users size={13} strokeWidth={1.75} aria-hidden />
                    {team.athleteIds.length} {team.athleteIds.length === 1 ? 'athlete' : 'athletes'}
                    {team.coachIds.length > 1 && ` · ${team.coachIds.length - 1} co-coach${team.coachIds.length > 2 ? 'es' : ''}`}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setInviteTeam(team)}>
                  Invite link
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {inviteTeam && <InviteLinkPanel team={inviteTeam} onClose={() => setInviteTeam(null)} />}
    </div>
  );
}
