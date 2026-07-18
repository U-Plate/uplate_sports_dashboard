import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api';
import type { AthleteDetailBundle, Timeframe } from '../types';
import { formatLongDate, formatShortDate } from '../lib/date';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MacroRings } from '../components/athlete/MacroRings';
import { WeightChart } from '../components/athlete/WeightChart';

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'season', label: 'Season' },
];

export default function AthleteDetail() {
  const { athleteId } = useParams<{ athleteId: string }>();
  const [timeframe, setTimeframe] = useState<Timeframe>('today');
  const [bundle, setBundle] = useState<AthleteDetailBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!athleteId) return;
    let cancelled = false;
    setLoading(true);
    api.athletes.getDetail(athleteId, timeframe).then((b) => {
      if (!cancelled) {
        setBundle(b);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [athleteId, timeframe]);

  if (loading && !bundle) {
    return <AthleteDetailSkeleton />;
  }

  if (!bundle) {
    return (
      <div className="uplate-empty-state">
        <span className="uplate-empty-state__title">Athlete not found</span>
        <p className="uplate-empty-state__body">This athlete may have left the team.</p>
      </div>
    );
  }

  const { athlete, status, statusReason, projection, today, range, weightHistory } = bundle;

  return (
    <div>
      <Link to="/" className="uplate-athlete-back">
        <ArrowLeft size={14} strokeWidth={2} />
        Back to roster
      </Link>

      <div className="uplate-athlete-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 'var(--type-headline)' }}>{athlete.name}</h1>
          <StatusBadge status={status} />
        </div>
        <p style={{ fontSize: 'var(--type-body)', color: 'var(--ink-2)' }}>{statusReason}</p>
      </div>

      <div className="uplate-zone">
        <span className="uplate-zone__eyebrow">Today's macros</span>
        <MacroRings totals={today.totals} goals={athlete.macroGoals} />
      </div>

      <div className="uplate-zone">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
          <span className="uplate-zone__eyebrow">Meal log</span>
          <div className="uplate-segmented" role="tablist" aria-label="Timeframe">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                type="button"
                role="tab"
                aria-selected={timeframe === tf.key}
                data-active={timeframe === tf.key}
                className="uplate-segmented__item"
                onClick={() => setTimeframe(tf.key)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {range.timeframe !== 'today' && (
          <p style={{ fontSize: 'var(--type-body)', color: 'var(--ink-2)', margin: 0 }}>
            Averaging <span className="tnum">{Math.round(range.totals.calories / range.days.length)}</span> cal/day
            this {range.timeframe === 'week' ? 'week' : 'season'}.
          </p>
        )}

        {timeframe === 'today' ? (
          today.meals.length === 0 ? (
            <p style={{ fontSize: 'var(--type-body)', color: 'var(--ink-3)' }}>No meals logged yet today.</p>
          ) : (
            <div>
              {today.meals.map((meal) => (
                <div key={meal.id} className="uplate-meal-row">
                  <div>
                    <div className="uplate-meal-row__name">{meal.name}</div>
                    <div className="uplate-meal-row__time">{meal.time}</div>
                  </div>
                  <div className="uplate-meal-row__macros tnum">
                    {meal.calories} cal · {meal.proteinG}p / {meal.carbsG}c / {meal.fatG}f
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div>
            {[...range.days].reverse().map((day) => (
              <div key={day.date} className="uplate-day-row">
                <span style={{ fontSize: 'var(--type-body)', color: 'var(--ink)' }}>{formatShortDate(day.date)}</span>
                <span className="tnum" style={{ fontSize: 'var(--type-meta)', color: day.totals.calories === 0 ? 'var(--ink-3)' : 'var(--ink-2)' }}>
                  {day.totals.calories === 0 ? 'No meals logged' : `${day.totals.calories} cal`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="uplate-zone">
        <span className="uplate-zone__eyebrow">Weight trend</span>
        <GoalWeightVerdict goalWeightLb={athlete.goalWeightLb} projection={projection} />
        {weightHistory.length > 0 && (
          <WeightChart history={weightHistory} goalWeightLb={athlete.goalWeightLb} />
        )}
      </div>
    </div>
  );
}

function GoalWeightVerdict({
  goalWeightLb,
  projection,
}: {
  goalWeightLb: number;
  projection: AthleteDetailBundle['projection'];
}) {
  if (projection.kind === 'insufficient-data') {
    return (
      <p className="uplate-athlete-verdict uplate-athlete-verdict--muted">
        Not enough weight history yet to project a goal date. Check back after a few more weigh-ins.
      </p>
    );
  }
  if (projection.kind === 'insufficient-trend') {
    return (
      <p className="uplate-athlete-verdict uplate-athlete-verdict--muted">
        Recent trend isn't moving toward the {goalWeightLb} lb goal yet.
      </p>
    );
  }
  if (projection.kind === 'at-goal') {
    return <p className="uplate-athlete-verdict">At goal weight.</p>;
  }
  const weeklyRate = Math.abs(projection.weeklyRateLb).toFixed(1);
  return (
    <p className="uplate-athlete-verdict">
      Projected to reach {goalWeightLb} lb around {formatLongDate(projection.projectedDate)}, about {weeklyRate} lb a
      week.
    </p>
  );
}

function AthleteDetailSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 'var(--s-5)' }} />
      <div className="skeleton" style={{ width: 220, height: 28, marginBottom: 'var(--s-3)' }} />
      <div className="skeleton" style={{ width: 260, height: 16, marginBottom: 'var(--s-6)' }} />
      <div className="skeleton" style={{ width: 132, height: 132, borderRadius: '50%' }} />
    </div>
  );
}
