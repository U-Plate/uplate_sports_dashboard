import { LayoutList, Settings as SettingsIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function MobileChrome() {
  return (
    <>
      <header className="uplate-mobile-topbar" aria-label="Mobile header">
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--type-body)', fontWeight: 600, color: 'var(--ink)' }}>
          UPlate Sports
        </span>
      </header>

      <BottomTabBar />
    </>
  );
}

function BottomTabBar() {
  return (
    <nav className="uplate-mobile-tabbar" aria-label="Quick navigation">
      <TabLink to="/" end label="Roster" icon={<LayoutList size={20} strokeWidth={1.75} />} />
      <TabLink to="/settings" label="Settings" icon={<SettingsIcon size={20} strokeWidth={1.75} />} />
    </nav>
  );
}

function TabLink({ to, label, icon, end }: { to: string; label: string; icon: React.ReactNode; end?: boolean }) {
  return (
    <NavLink to={to} end={end} style={({ isActive }) => tabButtonStyle(isActive)}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
    </NavLink>
  );
}

function tabButtonStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    minWidth: 0,
    height: '100%',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    border: 'none',
    background: 'transparent',
    color: active ? 'var(--accent)' : 'var(--ink-2)',
    textDecoration: 'none',
    cursor: 'pointer',
  };
}
