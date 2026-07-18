import type { AthleteStatus, DailyLog, MacroGoals } from '../types';
import { daysAgoIso, daysBetween } from './date';

export interface StatusResult {
  status: AthleteStatus;
  reason: string;
  lastLoggedDate: string | null;
}

const NOT_LOGGING_THRESHOLD_DAYS = 2;
const ATTENTION_DEVIATION = 0.12;
const OFF_TRACK_DEVIATION = 0.25;

export function computeAthleteStatus(
  logs: DailyLog[],
  goals: MacroGoals,
  today: string,
): StatusResult {
  const logged = logs.filter((log) => log.meals.length > 0).sort((a, b) => (a.date < b.date ? 1 : -1));
  const lastLoggedDate = logged[0]?.date ?? null;

  if (!lastLoggedDate) {
    return { status: 'not-logging', reason: "Hasn't logged any meals yet", lastLoggedDate: null };
  }

  const daysSinceLastLog = daysBetween(lastLoggedDate, today);
  if (daysSinceLastLog >= NOT_LOGGING_THRESHOLD_DAYS) {
    const noun = daysSinceLastLog === 1 ? 'day' : 'days';
    return {
      status: 'not-logging',
      reason: `Hasn't logged in ${daysSinceLastLog} ${noun}`,
      lastLoggedDate,
    };
  }

  const windowStart = daysAgoIso(2, new Date(`${today}T00:00:00`));
  const recent = logged.filter((log) => log.date >= windowStart && log.date <= today);
  const avgCalories =
    recent.reduce((sum, log) => sum + log.meals.reduce((s, m) => s + m.calories, 0), 0) / recent.length;

  const deviation = (avgCalories - goals.calories) / goals.calories;
  const pct = Math.round(Math.abs(deviation) * 100);
  const direction = deviation < 0 ? 'under' : 'over';

  if (Math.abs(deviation) <= ATTENTION_DEVIATION) {
    return {
      status: 'on-track',
      reason: pct === 0 ? 'Right at calorie goal this week' : `${pct}% ${direction} calorie goal this week`,
      lastLoggedDate,
    };
  }
  if (Math.abs(deviation) <= OFF_TRACK_DEVIATION) {
    return {
      status: 'attention',
      reason: `${pct}% ${direction} calorie goal the last few days`,
      lastLoggedDate,
    };
  }
  return {
    status: 'off-track',
    reason: `${pct}% ${direction} calorie goal the last few days`,
    lastLoggedDate,
  };
}
