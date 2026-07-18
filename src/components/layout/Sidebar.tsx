import { NavLink } from 'react-router-dom';
import { LayoutList, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const NAV = [
  { to: '/', label: 'Roster', icon: <LayoutList size={17} strokeWidth={1.75} />, end: true },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon size={17} strokeWidth={1.75} /> },
];

function initials(name: string | undefined): string {
  if (!name) return 'C';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { coach, signOut } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--s-5) var(--s-4) var(--s-4)', gap: 'var(--s-4)' }}>
      <header className="uplate-sidebar__brand">
        <div className="uplate-sidebar__masthead">
          <span className="uplate-sidebar__wordmark">UPlate</span>
          <span className="uplate-sidebar__brandqual">Sports Dashboard</span>
        </div>
      </header>

      <nav aria-label="Primary" className="uplate-sidebar__nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `uplate-sidebar__item${isActive ? ' uplate-sidebar__item--active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <span aria-hidden className="uplate-sidebar__item-icon">
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <span className="sr-only">(current page)</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <div style={{ height: 1, background: 'var(--hairline)' }} aria-hidden />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', padding: '0 var(--s-3)' }}>
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--r-md)',
              background: 'var(--accent-tint)',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials(coach?.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontSize: 'var(--type-meta)',
                color: 'var(--ink)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {coach?.name ?? 'Signed in'}
            </span>
            <span style={{ fontSize: 'var(--type-eyebrow)', color: 'var(--ink-3)' }}>Coach</span>
          </div>
          <button type="button" aria-label="Sign out" onClick={() => void signOut()} className="uplate-sidebar__signout">
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside
      className="uplate-shell__sidebar"
      style={{
        width: 'var(--sidebar-w)',
        height: '100dvh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        background: 'var(--surface-sunken)',
        borderRight: '1px solid var(--hairline)',
      }}
    >
      <SidebarBody />
    </aside>
  );
}
