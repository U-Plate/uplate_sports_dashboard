export type AthleteStatus = 'on-track' | 'attention' | 'off-track' | 'not-logging';
export type GoalType = 'lose' | 'maintain' | 'gain';
export type ActivitySource = 'wearable' | 'manual';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extremely';
export type Timeframe = 'today' | 'week' | 'season';

export interface Coach {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  coachIds: string[];
  athleteIds: string[];
  inviteCode: string;
  createdAt: string;
}

export interface MacroGoals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MacroTotals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Athlete {
  id: string;
  name: string;
  teamIds: string[];
  goalType: GoalType;
  goalWeightLb: number;
  activitySource: ActivitySource;
  activityLevel: ActivityLevel;
  macroGoals: MacroGoals;
}

/** Per-serving detail behind a logged food, as the UPlate app records it. */
export interface MealNutrition {
  servingSize: string;
  caloriesFromFat: number;
  saturatedFatG: number;
  sugarG: number;
  addedSugarsG: number;
  dietaryFiberG: number;
  sodiumMg: number;
  cholesterolMg: number;
  calciumMg: number;
  ironMg: number;
  ingredients: string;
  labels: string[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  nutrition: MealNutrition;
}

export interface DailyLog {
  athleteId: string;
  date: string;
  meals: Meal[];
}

export interface WeightEntry {
  athleteId: string;
  date: string;
  weightLb: number;
}

export interface AthleteRosterRow {
  athlete: Athlete;
  status: AthleteStatus;
  statusReason: string;
  lastLoggedDate: string | null;
}

export interface DayBreakdown {
  date: string;
  totals: MacroTotals;
  meals: Meal[];
}

export type GoalWeightProjection =
  | { kind: 'insufficient-data' }
  | { kind: 'insufficient-trend' }
  | { kind: 'at-goal' }
  | { kind: 'projected'; projectedDate: string; weeklyRateLb: number };

export interface AthleteDetailBundle {
  athlete: Athlete;
  status: AthleteStatus;
  statusReason: string;
  currentWeightLb: number | null;
  today: { totals: MacroTotals; meals: Meal[] };
  range: { timeframe: Timeframe; totals: MacroTotals; days: DayBreakdown[] };
  weightHistory: WeightEntry[];
  projection: GoalWeightProjection;
}
