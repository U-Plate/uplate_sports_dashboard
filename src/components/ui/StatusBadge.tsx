import type { AthleteStatus } from '../../types';

const LABEL: Record<AthleteStatus, string> = {
  'on-track': 'On track',
  attention: 'Needs attention',
  'off-track': 'Off track',
  'not-logging': 'Not logging',
};

const CLASS: Record<AthleteStatus, string> = {
  'on-track': 'uplate-status-badge--on-track',
  attention: 'uplate-status-badge--attention',
  'off-track': 'uplate-status-badge--off-track',
  'not-logging': 'uplate-status-badge--not-logging',
};

export function StatusBadge({ status, label }: { status: AthleteStatus; label?: string }) {
  return <span className={`uplate-status-badge ${CLASS[status]}`}>{label ?? LABEL[status]}</span>;
}
