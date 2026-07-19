import { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { DayBreakdown } from '../../types';
import { formatShortDate } from '../../lib/date';
import { MealRow } from './MealRow';

/**
 * One day in the week/season log, expanding to the meals logged that day.
 *
 * Days with nothing logged aren't expandable: an empty drawer would be a dead
 * affordance, and "no meals logged" is already the whole answer.
 */
export function DayRow({ day }: { day: DayBreakdown }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const logged = day.meals.length > 0;
  const mealCount = `${day.meals.length} ${day.meals.length === 1 ? 'meal' : 'meals'}`;

  if (!logged) {
    return (
      <div className="uplate-day uplate-day--empty">
        <span className="uplate-day__date">{formatShortDate(day.date)}</span>
        <span className="uplate-day__value">No meals logged</span>
      </div>
    );
  }

  return (
    <div className="uplate-day">
      <button
        type="button"
        className="uplate-day__summary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight size={15} strokeWidth={2} aria-hidden className="uplate-meal__chevron" data-open={open} />
        <span className="uplate-day__date">{formatShortDate(day.date)}</span>
        <span className="uplate-day__meta">{mealCount}</span>
        <span className="uplate-day__value tnum">{day.totals.calories} cal</span>
      </button>

      {open && (
        <div id={panelId} className="uplate-day__meals">
          {day.meals.map((meal) => (
            <MealRow key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
