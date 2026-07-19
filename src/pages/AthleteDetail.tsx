import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api';
import type { AthleteDetailBundle, Timeframe } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MacroRings } from '../components/athlete/MacroRings';
import { WeightChart } from '../components/athlete/WeightChart';
import { GoalTrack } from '../components/athlete/GoalTrack';
import { MealRow } from '../components/athlete/MealRow';
import { DayRow } from '../components/athlete/DayRow';

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
        <h1 className="uplate-empty-state__title">Athlete not found</h1>
        <p className="uplate-empty-state__body">This athlete may have left the team.</p>
      </div>
    );
  }

  const { athlete, status, statusReason, projection, today, range, weightHistory, currentWeightLb } = bundle;

  return (
    <div>
      <Link to="/" className="uplate-athlete-back">
        <ArrowLeft size={14} strokeWidth={2} />
        Back to roster
      </Link>

      <div className="uplate-athlete-header">
        <div className="uplate-athlete-header__identity">
          <h1 className="uplate-page-head__title">{athlete.name}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="uplate-athlete-header__reason">{statusReason}</p>
      </div>

      <div className="uplate-zone">
        <span className="uplate-zone__eyebrow">Today's macros</span>
        <MacroRings totals={today.totals} goals={athlete.macroGoals} />
      </div>

      <div className="uplate-zone">
        <div className="uplate-zone__head">
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

        {range.timeframe !== 'today' && <RangeAverage range={range} />}

        {timeframe === 'today' ? (
          today.meals.length === 0 ? (
            <p className="uplate-zone__empty">No meals logged yet today.</p>
          ) : (
            <div className="uplate-log">
              {today.meals.map((meal) => (
                <MealRow key={meal.id} meal={meal} />
              ))}
            </div>
          )
        ) : (
          // Keyed by timeframe so switching Week to Season collapses the log
          // instead of carrying one day's open state into a different view.
          <div className="uplate-log" key={range.timeframe}>
            {[...range.days].reverse().map((day) => (
              <DayRow key={day.date} day={day} />
            ))}
          </div>
        )}
      </div>

      <div className="uplate-zone">
        <span className="uplate-zone__eyebrow">Weight trend</span>
        <GoalTrack
          history={weightHistory}
          goalWeightLb={athlete.goalWeightLb}
          currentWeightLb={currentWeightLb}
          projection={projection}
        />
        {weightHistory.length > 0 && (
          <WeightChart history={weightHistory} goalWeightLb={athlete.goalWeightLb} />
        )}
      </div>
    </div>
  );
}

/**
 * Averages across days the athlete actually logged, never across the whole
 * calendar window: dividing by unlogged days would quietly understate intake
 * and read as a verdict the data doesn't support.
 */
function RangeAverage({ range }: { range: AthleteDetailBundle['range'] }) {
  const period = range.timeframe === 'week' ? 'this week' : 'this season';
  const loggedDays = range.days.filter((day) => day.totals.calories > 0);

  if (loggedDays.length === 0) {
    return <p className="uplate-range-note">No meals logged {period}.</p>;
  }

  const average = Math.round(
    loggedDays.reduce((sum, day) => sum + day.totals.calories, 0) / loggedDays.length,
  );

  return (
    <p className="uplate-range-note">
      Averaging <span className="tnum">{average}</span> cal on the{' '}
      {loggedDays.length === 1 ? 'one day' : `${loggedDays.length} days`} logged {period}.
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
