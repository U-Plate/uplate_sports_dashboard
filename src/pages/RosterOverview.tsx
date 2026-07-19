import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, UserPlus } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { api } from '../api';
import type { AthleteRosterRow } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { InviteLinkPanel } from '../components/team/InviteLinkPanel';

export default function RosterOverview() {
  const { teams, loading: teamsLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const openInviteForTeamId = (location.state as { openInviteForTeamId?: string } | null)?.openInviteForTeamId;
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(openInviteForTeamId ?? null);
  const [rows, setRows] = useState<AthleteRosterRow[] | null>(null);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(Boolean(openInviteForTeamId));

  useEffect(() => {
    if (!selectedTeamId && teams.length > 0) setSelectedTeamId(teams[0].id);
  }, [teams, selectedTeamId]);

  useEffect(() => {
    if (!selectedTeamId) return;
    let cancelled = false;
    setRosterLoading(true);
    api.athletes.listRosterForTeam(selectedTeamId).then((r) => {
      if (!cancelled) {
        setRows(r);
        setRosterLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedTeamId]);

  if (teamsLoading) {
    return (
      <div>
        <div className="uplate-page-head">
          <h1 className="uplate-page-head__title">Roster</h1>
        </div>
        <SkeletonRows />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div>
        <div className="uplate-page-head">
          <h1 className="uplate-page-head__title">Roster</h1>
        </div>
        <div className="uplate-empty-state">
          <h2 className="uplate-empty-state__title">Create your first team</h2>
          <p className="uplate-empty-state__body">
            Once you create a team, you'll get a link to share with your athletes. They join with the UPlate app they
            already use to log their meals and weight.
          </p>
          <Button onClick={() => navigate('/teams/new')}>Create a team</Button>
        </div>
      </div>
    );
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0];

  return (
    <div>
      <div className="uplate-page-head">
        <div>
          <h1 className="uplate-page-head__title">Roster</h1>
          <p className="uplate-page-head__meta">{selectedTeam.name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={() => setInviteOpen(true)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <UserPlus size={15} strokeWidth={1.75} />
              Invite athletes
            </span>
          </Button>
          <Link to="/teams/new" className="uplate-btn-ghost" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            New team
          </Link>
        </div>
      </div>

      {teams.length > 1 && (
        <>
          <div className="uplate-team-switcher" role="tablist" aria-label="Teams" style={{ marginBottom: 'var(--s-5)' }}>
            {teams.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === selectedTeam.id}
                data-active={t.id === selectedTeam.id}
                className="uplate-team-switcher__item"
                onClick={() => setSelectedTeamId(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="uplate-team-select" style={{ marginBottom: 'var(--s-5)' }}>
            <select
              aria-label="Team"
              value={selectedTeam.id}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="uplate-team-select__input"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} strokeWidth={1.75} className="uplate-team-select__chevron" aria-hidden />
          </div>
        </>
      )}

      {rosterLoading ? (
        <SkeletonRows />
      ) : !rows || rows.length === 0 ? (
        <div className="uplate-empty-state">
          <h2 className="uplate-empty-state__title">No athletes on this team yet</h2>
          <p className="uplate-empty-state__body">
            Share the invite link and athletes will show up here as soon as they join from the UPlate app.
          </p>
          <Button onClick={() => setInviteOpen(true)}>Share invite link</Button>
        </div>
      ) : (
        <div className="uplate-roster-list" role="list" aria-label="Athletes">
          {rows.map((row) => (
            <Link key={row.athlete.id} to={`/athletes/${row.athlete.id}`} className="uplate-roster-row" role="listitem">
              <StatusBadge status={row.status} />
              <div className="uplate-roster-row__main">
                <span className="uplate-roster-row__name">{row.athlete.name}</span>
                <span className="uplate-roster-row__meta">{row.statusReason}</span>
              </div>
              <ChevronRight size={18} strokeWidth={1.75} className="uplate-roster-row__chevron" aria-hidden />
            </Link>
          ))}
        </div>
      )}

      {inviteOpen && <InviteLinkPanel team={selectedTeam} onClose={() => setInviteOpen(false)} />}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div aria-hidden style={{ borderTop: '1px solid var(--hairline)' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="uplate-skeleton-row">
          <div className="skeleton" style={{ width: 72, height: 20, borderRadius: 999 }} />
          <div className="skeleton" style={{ flex: 1, maxWidth: 240, height: 14 }} />
        </div>
      ))}
    </div>
  );
}
