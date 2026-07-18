import type { GoalWeightProjection, WeightEntry } from '../types';
import { daysAgoIso, daysBetween, isoDate } from './date';

const LOOKBACK_DAYS = 21;
const MIN_ENTRIES = 8;
const AT_GOAL_TOLERANCE_LB = 0.5;
const MAX_PROJECTION_DAYS = 365;

/**
 * Simple least-squares trend over the lookback window. Deliberately not a
 * clinical model: DESIGN.md requires the result read as an estimate, and an
 * over-engineered fit would just be a more confident-looking guess.
 */
export function computeGoalWeightProjection(
  weightHistory: WeightEntry[],
  goalWeightLb: number,
  today: string,
): GoalWeightProjection {
  const windowStart = daysAgoIso(LOOKBACK_DAYS, new Date(`${today}T00:00:00`));
  const entries = weightHistory
    .filter((e) => e.date >= windowStart && e.date <= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  if (entries.length < MIN_ENTRIES) {
    return { kind: 'insufficient-data' };
  }

  const x = entries.map((e) => daysBetween(entries[0].date, e.date));
  const y = entries.map((e) => e.weightLb);
  const n = entries.length;
  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY);
    den += (x[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;

  const currentWeightLb = y[y.length - 1];
  const diff = goalWeightLb - currentWeightLb;

  if (Math.abs(diff) <= AT_GOAL_TOLERANCE_LB) {
    return { kind: 'at-goal' };
  }

  const neededDirection = diff > 0 ? 1 : -1;
  const trendDirection = slope > 0 ? 1 : slope < 0 ? -1 : 0;

  if (trendDirection !== neededDirection || Math.abs(slope) < 0.01) {
    return { kind: 'insufficient-trend' };
  }

  const daysToGoal = diff / slope;
  if (!Number.isFinite(daysToGoal) || daysToGoal > MAX_PROJECTION_DAYS) {
    return { kind: 'insufficient-trend' };
  }

  const projectedDate = isoDate(new Date(new Date(`${today}T00:00:00`).getTime() + daysToGoal * 86_400_000));

  return { kind: 'projected', projectedDate, weeklyRateLb: slope * 7 };
}
