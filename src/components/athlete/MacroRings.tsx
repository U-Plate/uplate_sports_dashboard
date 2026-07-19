import type { MacroGoals, MacroTotals } from '../../types';

const RING_DEFS = [
  { key: 'calories' as const, color: 'var(--macro-calories)', radius: 52 },
  { key: 'proteinG' as const, color: 'var(--macro-protein)', radius: 40 },
  { key: 'carbsG' as const, color: 'var(--macro-carbs)', radius: 28 },
  { key: 'fatG' as const, color: 'var(--macro-fat)', radius: 16 },
];

const LABEL: Record<(typeof RING_DEFS)[number]['key'], string> = {
  calories: 'Calories',
  proteinG: 'Protein',
  carbsG: 'Carbs',
  fatG: 'Fat',
};

const UNIT: Record<(typeof RING_DEFS)[number]['key'], string> = {
  calories: 'cal',
  proteinG: 'g',
  carbsG: 'g',
  fatG: 'g',
};

export function MacroRings({ totals, goals }: { totals: MacroTotals; goals: MacroGoals }) {
  const size = 132;
  const center = size / 2;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-6)', flexWrap: 'wrap' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Today's macro progress">
        {RING_DEFS.map(({ key, color, radius }) => {
          const circumference = 2 * Math.PI * radius;
          const pct = Math.min(1, totals[key] / Math.max(1, goals[key]));
          return (
            <g key={key} transform={`rotate(-90 ${center} ${center})`}>
              <circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth={10} opacity={0.15} />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={`${circumference * pct} ${circumference}`}
                style={{ transition: 'stroke-dasharray var(--motion-slow) var(--ease-out-expo)' }}
              />
            </g>
          );
        })}
      </svg>
      <dl style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 'var(--s-4)', rowGap: 6, margin: 0 }}>
        {RING_DEFS.map(({ key, color }) => (
          <div key={key} style={{ display: 'contents' }}>
            <dt style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--type-meta)', color: 'var(--ink-2)' }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              {LABEL[key]}
            </dt>
            <dd className="tnum" style={{ margin: 0, fontSize: 'var(--type-meta)', color: 'var(--ink)', fontWeight: 600 }}>
              {Math.round(totals[key])} / {Math.round(goals[key])} {UNIT[key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
