import type { Athlete, Coach, DailyLog, GoalType, MacroGoals, Meal, MealNutrition, Team, WeightEntry } from '../types';
import { daysAgoIso, todayIso } from '../lib/date';
import { makeId, makeInviteCode } from '../lib/id';
import { mulberry32, pick, range } from '../lib/rng';

const FIRST_NAMES = [
  'Avery', 'Jordan', 'Maya', 'Diego', 'Priya', 'Ethan', 'Sofia', 'Marcus',
  'Nina', 'Caleb', 'Zoe', 'Liam', 'Amara', 'Tyler', 'Ines', 'Owen',
  'Talia', 'Malik', 'Ruby', 'Hassan', 'Delaney', 'Kofi', 'Willa', 'Santiago',
];
const LAST_NAMES = [
  'Reyes', 'Nguyen', 'Okafor', 'Kowalski', 'Patel', 'Meyer', 'Sato', 'Diaz',
  'Coleman', 'Vargas', 'Lindgren', 'Boateng', 'Fischer', 'Alvarez', 'Novak', 'Hughes',
];

const MEAL_LIBRARY: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', Omit<Meal, 'id' | 'time' | 'nutrition'>[]> = {
  breakfast: [
    { name: 'Oatmeal, banana, peanut butter', calories: 520, proteinG: 22, carbsG: 68, fatG: 18 },
    { name: 'Greek yogurt parfait', calories: 380, proteinG: 28, carbsG: 45, fatG: 9 },
    { name: 'Egg white veggie scramble', calories: 410, proteinG: 34, carbsG: 24, fatG: 20 },
    { name: 'Bagel with cream cheese', calories: 460, proteinG: 16, carbsG: 58, fatG: 16 },
  ],
  lunch: [
    { name: 'Grilled chicken burrito bowl', calories: 720, proteinG: 48, carbsG: 70, fatG: 24 },
    { name: 'Turkey club sandwich', calories: 650, proteinG: 34, carbsG: 58, fatG: 28 },
    { name: 'Salmon salad', calories: 580, proteinG: 40, carbsG: 32, fatG: 30 },
    { name: 'Pasta primavera', calories: 610, proteinG: 22, carbsG: 86, fatG: 18 },
  ],
  dinner: [
    { name: 'Steak with sweet potato', calories: 780, proteinG: 52, carbsG: 54, fatG: 32 },
    { name: 'Chicken stir-fry', calories: 640, proteinG: 44, carbsG: 62, fatG: 20 },
    { name: 'Salmon, rice, broccoli', calories: 700, proteinG: 46, carbsG: 68, fatG: 24 },
    { name: 'Tofu vegetable stir-fry', calories: 520, proteinG: 28, carbsG: 58, fatG: 18 },
  ],
  snack: [
    { name: 'Protein shake', calories: 240, proteinG: 30, carbsG: 14, fatG: 6 },
    { name: 'Trail mix', calories: 280, proteinG: 9, carbsG: 28, fatG: 16 },
    { name: 'Greek yogurt', calories: 150, proteinG: 15, carbsG: 12, fatG: 5 },
    { name: 'Apple with almond butter', calories: 220, proteinG: 6, carbsG: 24, fatG: 12 },
  ],
};

/**
 * Per-serving detail keyed by meal name. Values are plausible dining-hall
 * figures, not clinical data: this is mock seed standing in for what the UPlate
 * app records against each logged food.
 */
type MealDetailSeed = Omit<MealNutrition, 'caloriesFromFat'>;

const MEAL_DETAIL: Record<string, MealDetailSeed> = {
  'Oatmeal, banana, peanut butter': {
    servingSize: '1 bowl (340 g)',
    saturatedFatG: 3.4, sugarG: 16, addedSugarsG: 4, dietaryFiberG: 8.2,
    sodiumMg: 180, cholesterolMg: 0, calciumMg: 120, ironMg: 3.1,
    ingredients: 'Whole grain rolled oats, banana, peanut butter (peanuts, salt), milk, cinnamon, honey.',
    labels: ['Vegetarian'],
  },
  'Greek yogurt parfait': {
    servingSize: '1 cup (280 g)',
    saturatedFatG: 4.1, sugarG: 24, addedSugarsG: 9, dietaryFiberG: 3.4,
    sodiumMg: 110, cholesterolMg: 22, calciumMg: 310, ironMg: 0.9,
    ingredients: 'Greek yogurt (cultured nonfat milk), granola (oats, honey, almonds), mixed berries.',
    labels: ['Vegetarian', 'Contains milk', 'Contains tree nuts'],
  },
  'Egg white veggie scramble': {
    servingSize: '1 plate (250 g)',
    saturatedFatG: 4.8, sugarG: 5, addedSugarsG: 0, dietaryFiberG: 3.1,
    sodiumMg: 460, cholesterolMg: 15, calciumMg: 140, ironMg: 2.4,
    ingredients: 'Egg whites, bell pepper, spinach, onion, mushroom, olive oil, salt, black pepper.',
    labels: ['Vegetarian', 'Gluten free'],
  },
  'Bagel with cream cheese': {
    servingSize: '1 bagel (145 g)',
    saturatedFatG: 8.2, sugarG: 8, addedSugarsG: 5, dietaryFiberG: 2.4,
    sodiumMg: 620, cholesterolMg: 38, calciumMg: 90, ironMg: 3.6,
    ingredients: 'Enriched wheat flour, water, yeast, malt, salt, cream cheese (milk, cream, cheese culture).',
    labels: ['Vegetarian', 'Contains wheat', 'Contains milk'],
  },
  'Grilled chicken burrito bowl': {
    servingSize: '1 bowl (520 g)',
    saturatedFatG: 6.1, sugarG: 6, addedSugarsG: 1, dietaryFiberG: 11.4,
    sodiumMg: 1180, cholesterolMg: 115, calciumMg: 180, ironMg: 4.2,
    ingredients: 'Grilled chicken, brown rice, black beans, pico de gallo, romaine, lime, cilantro, olive oil.',
    labels: ['Gluten free', 'High protein'],
  },
  'Turkey club sandwich': {
    servingSize: '1 sandwich (310 g)',
    saturatedFatG: 9.4, sugarG: 7, addedSugarsG: 3, dietaryFiberG: 4.1,
    sodiumMg: 1340, cholesterolMg: 82, calciumMg: 160, ironMg: 3.8,
    ingredients: 'Wheat bread, roasted turkey breast, bacon, lettuce, tomato, mayonnaise.',
    labels: ['Contains wheat', 'Contains egg'],
  },
  'Salmon salad': {
    servingSize: '1 plate (390 g)',
    saturatedFatG: 5.6, sugarG: 5, addedSugarsG: 2, dietaryFiberG: 5.2,
    sodiumMg: 520, cholesterolMg: 88, calciumMg: 140, ironMg: 2.1,
    ingredients: 'Atlantic salmon, mixed greens, cucumber, cherry tomato, red onion, olive oil, lemon vinaigrette.',
    labels: ['Gluten free', 'Contains fish', 'High protein'],
  },
  'Pasta primavera': {
    servingSize: '1 plate (420 g)',
    saturatedFatG: 5.2, sugarG: 11, addedSugarsG: 2, dietaryFiberG: 7.4,
    sodiumMg: 680, cholesterolMg: 18, calciumMg: 210, ironMg: 4.4,
    ingredients: 'Penne pasta (durum wheat semolina), zucchini, squash, bell pepper, garlic, olive oil, parmesan.',
    labels: ['Vegetarian', 'Contains wheat', 'Contains milk'],
  },
  'Steak with sweet potato': {
    servingSize: '1 plate (450 g)',
    saturatedFatG: 11.8, sugarG: 12, addedSugarsG: 0, dietaryFiberG: 6.8,
    sodiumMg: 740, cholesterolMg: 142, calciumMg: 90, ironMg: 5.6,
    ingredients: 'Sirloin steak, sweet potato, butter, rosemary, garlic, salt, black pepper.',
    labels: ['Gluten free', 'Contains milk', 'High protein'],
  },
  'Chicken stir-fry': {
    servingSize: '1 bowl (480 g)',
    saturatedFatG: 4.2, sugarG: 13, addedSugarsG: 6, dietaryFiberG: 6.1,
    sodiumMg: 1220, cholesterolMg: 108, calciumMg: 120, ironMg: 3.9,
    ingredients: 'Chicken breast, jasmine rice, broccoli, carrot, snap pea, soy sauce (wheat, soybeans), ginger, sesame oil.',
    labels: ['Contains soy', 'Contains wheat', 'High protein'],
  },
  'Salmon, rice, broccoli': {
    servingSize: '1 plate (440 g)',
    saturatedFatG: 4.6, sugarG: 4, addedSugarsG: 0, dietaryFiberG: 6.4,
    sodiumMg: 480, cholesterolMg: 94, calciumMg: 130, ironMg: 2.8,
    ingredients: 'Atlantic salmon, brown rice, broccoli, olive oil, lemon, salt.',
    labels: ['Gluten free', 'Contains fish', 'High protein'],
  },
  'Tofu vegetable stir-fry': {
    servingSize: '1 bowl (460 g)',
    saturatedFatG: 2.8, sugarG: 12, addedSugarsG: 5, dietaryFiberG: 8.6,
    sodiumMg: 980, cholesterolMg: 0, calciumMg: 340, ironMg: 5.2,
    ingredients: 'Firm tofu (soybeans), brown rice, bok choy, carrot, mushroom, soy sauce (wheat, soybeans), sesame oil.',
    labels: ['Vegan', 'Vegetarian', 'Contains soy', 'Contains wheat'],
  },
  'Protein shake': {
    servingSize: '1 shaker (400 ml)',
    saturatedFatG: 1.2, sugarG: 4, addedSugarsG: 2, dietaryFiberG: 1.8,
    sodiumMg: 220, cholesterolMg: 25, calciumMg: 280, ironMg: 1.1,
    ingredients: 'Whey protein isolate (milk), water, cocoa, natural flavor, sucralose.',
    labels: ['Vegetarian', 'Contains milk', 'High protein'],
  },
  'Trail mix': {
    servingSize: '1/2 cup (60 g)',
    saturatedFatG: 3.1, sugarG: 14, addedSugarsG: 8, dietaryFiberG: 3.6,
    sodiumMg: 95, cholesterolMg: 0, calciumMg: 60, ironMg: 1.7,
    ingredients: 'Almonds, cashews, raisins, dried cranberries (sugar), dark chocolate chips (soy lecithin).',
    labels: ['Vegetarian', 'Contains tree nuts', 'Contains soy'],
  },
  'Greek yogurt': {
    servingSize: '1 cup (170 g)',
    saturatedFatG: 3.2, sugarG: 9, addedSugarsG: 0, dietaryFiberG: 0,
    sodiumMg: 65, cholesterolMg: 18, calciumMg: 220, ironMg: 0.2,
    ingredients: 'Cultured pasteurized nonfat milk, live active cultures.',
    labels: ['Vegetarian', 'Gluten free', 'Contains milk'],
  },
  'Apple with almond butter': {
    servingSize: '1 apple + 2 tbsp (210 g)',
    saturatedFatG: 1.1, sugarG: 21, addedSugarsG: 0, dietaryFiberG: 6.2,
    sodiumMg: 40, cholesterolMg: 0, calciumMg: 95, ironMg: 1.4,
    ingredients: 'Apple, almond butter (dry roasted almonds, sea salt).',
    labels: ['Vegan', 'Vegetarian', 'Gluten free', 'Contains tree nuts'],
  },
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Scales the per-serving figures alongside the macros they belong to. */
function scaleNutrition(name: string, fatG: number, factor: number): MealNutrition {
  const base = MEAL_DETAIL[name];
  return rescaleNutrition({ ...base, caloriesFromFat: 0 }, fatG, factor);
}

function rescaleNutrition(from: MealNutrition, fatG: number, factor: number): MealNutrition {
  return {
    servingSize: from.servingSize,
    ingredients: from.ingredients,
    labels: from.labels,
    caloriesFromFat: Math.round(fatG * 9),
    saturatedFatG: round1(from.saturatedFatG * factor),
    sugarG: round1(from.sugarG * factor),
    addedSugarsG: round1(from.addedSugarsG * factor),
    dietaryFiberG: round1(from.dietaryFiberG * factor),
    sodiumMg: Math.round(from.sodiumMg * factor),
    cholesterolMg: Math.round(from.cholesterolMg * factor),
    calciumMg: Math.round(from.calciumMg * factor),
    ironMg: round1(from.ironMg * factor),
  };
}

const MEAL_TIMES: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', string> = {
  breakfast: '7:45 AM',
  lunch: '12:30 PM',
  dinner: '6:15 PM',
  snack: '3:30 PM',
};

type Archetype =
  | 'reliable'
  | 'steady-maintainer'
  | 'slow-climber'
  | 'plateaued'
  | 'drifting-away'
  | 'flat-off-track'
  | 'quiet-but-watched'
  | 'just-joined';

const ARCHETYPES: Archetype[] = [
  'reliable',
  'steady-maintainer',
  'slow-climber',
  'plateaued',
  'drifting-away',
  'flat-off-track',
  'quiet-but-watched',
  'just-joined',
];

function macroGoalsFor(rand: () => number, goalType: GoalType): MacroGoals {
  const baseCalories =
    goalType === 'lose' ? range(rand, 1900, 2200) : goalType === 'gain' ? range(rand, 2900, 3400) : range(rand, 2300, 2600);
  const calories = Math.round(baseCalories / 10) * 10;
  const proteinG = Math.round((calories * 0.3) / 4);
  const fatG = Math.round((calories * 0.28) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
  return { calories, proteinG, carbsG, fatG };
}

function scaledMeal(rand: () => number, slot: keyof typeof MEAL_LIBRARY): Meal {
  const base = pick(rand, MEAL_LIBRARY[slot]);
  const scale = range(rand, 0.88, 1.12);
  const fatG = Math.round(base.fatG * scale);
  return {
    id: makeId('meal', rand),
    name: base.name,
    time: MEAL_TIMES[slot],
    calories: Math.round(base.calories * scale),
    proteinG: Math.round(base.proteinG * scale),
    carbsG: Math.round(base.carbsG * scale),
    fatG,
    nutrition: scaleNutrition(base.name, fatG, scale),
  };
}

function generateDayMeals(rand: () => number, targetCalories: number): Meal[] {
  const slots: (keyof typeof MEAL_LIBRARY)[] =
    rand() > 0.35 ? ['breakfast', 'lunch', 'dinner', 'snack'] : ['breakfast', 'lunch', 'dinner'];
  const meals = slots.map((slot) => scaledMeal(rand, slot));
  const currentTotal = meals.reduce((s, m) => s + m.calories, 0);
  const factor = targetCalories / currentTotal;
  return meals.map((m) => {
    const fatG = Math.round(m.fatG * factor);
    return {
      ...m,
      calories: Math.round(m.calories * factor),
      proteinG: Math.round(m.proteinG * factor),
      carbsG: Math.round(m.carbsG * factor),
      fatG,
      // Rescale what scaledMeal already produced rather than recomputing from
      // base, so nutrition tracks the same base × scale × factor as the macros.
      nutrition: rescaleNutrition(m.nutrition, fatG, factor),
    };
  });
}

function generateLogs(rand: () => number, athleteId: string, goals: MacroGoals, archetype: Archetype): DailyLog[] {
  const today = todayIso();
  const logs: DailyLog[] = [];
  const goneQuietAfterDays = archetype === 'quiet-but-watched' ? 4 : null;

  for (let d = 29; d >= 0; d--) {
    const date = daysAgoIso(d, new Date(`${today}T00:00:00`));

    if (goneQuietAfterDays !== null && d < goneQuietAfterDays) {
      logs.push({ athleteId, date, meals: [] });
      continue;
    }
    if (archetype === 'just-joined' && d > 4) {
      logs.push({ athleteId, date, meals: [] });
      continue;
    }
    if (rand() < 0.05) {
      logs.push({ athleteId, date, meals: [] });
      continue;
    }

    let deviation = 0;
    switch (archetype) {
      case 'reliable':
      case 'just-joined':
        deviation = range(rand, -0.08, 0.08);
        break;
      case 'steady-maintainer':
        deviation = range(rand, -0.06, 0.06);
        break;
      case 'slow-climber':
        deviation = range(rand, -0.18, -0.1);
        break;
      case 'plateaued':
        deviation = range(rand, -0.2, 0.14);
        break;
      case 'drifting-away':
        deviation = range(rand, 0.26, 0.38);
        break;
      case 'flat-off-track':
        deviation = range(rand, -0.4, -0.28);
        break;
      case 'quiet-but-watched':
        deviation = range(rand, -0.08, 0.08);
        break;
    }
    const targetCalories = Math.max(1200, Math.round(goals.calories * (1 + deviation)));
    logs.push({ athleteId, date, meals: generateDayMeals(rand, targetCalories) });
  }

  return logs;
}

function generateWeightHistory(
  rand: () => number,
  athleteId: string,
  startWeight: number,
  goalWeightLb: number,
  archetype: Archetype,
): WeightEntry[] {
  const today = todayIso();
  const entries: WeightEntry[] = [];
  const gapToGoal = goalWeightLb - startWeight;

  let totalChangeFraction: number;
  switch (archetype) {
    case 'reliable':
    case 'quiet-but-watched':
      totalChangeFraction = range(rand, 0.35, 0.55);
      break;
    case 'slow-climber':
      totalChangeFraction = range(rand, 0.15, 0.25);
      break;
    case 'steady-maintainer':
    case 'plateaued':
      totalChangeFraction = range(rand, -0.05, 0.05);
      break;
    case 'drifting-away':
    case 'flat-off-track':
      totalChangeFraction = range(rand, -0.3, -0.15);
      break;
    case 'just-joined':
      totalChangeFraction = 0;
      break;
  }

  const totalChange = gapToGoal * totalChangeFraction;
  const historyDays = archetype === 'just-joined' ? 5 : 21;

  for (let d = historyDays - 1; d >= 0; d--) {
    if (rand() < 0.15) continue;
    const date = daysAgoIso(d, new Date(`${today}T00:00:00`));
    const progress = 1 - d / (historyDays - 1);
    const weight = startWeight + totalChange * progress + range(rand, -0.35, 0.35);
    entries.push({ athleteId, date, weightLb: Math.round(weight * 10) / 10 });
  }

  return entries;
}

export interface MockDatabase {
  coaches: Coach[];
  teams: Team[];
  athletes: Athlete[];
  logsByAthlete: Map<string, DailyLog[]>;
  weightByAthlete: Map<string, WeightEntry[]>;
  credentials: Map<string, { coachId: string; password: string }>;
}

function buildAthlete(rand: () => number, teamIds: string[], index: number): {
  athlete: Athlete;
  archetype: Archetype;
  startWeightLb: number;
} {
  const goalType: GoalType = pick(rand, ['lose', 'maintain', 'gain'] as const);
  const startWeight = Math.round(range(rand, 128, 205));
  const goalDelta =
    goalType === 'lose' ? -range(rand, 8, 22) : goalType === 'gain' ? range(rand, 6, 16) : range(rand, -3, 3);
  const archetype = ARCHETYPES[index % ARCHETYPES.length];

  const athlete: Athlete = {
    id: makeId('athlete', rand),
    name: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
    teamIds,
    goalType,
    goalWeightLb: Math.round((startWeight + goalDelta) * 10) / 10,
    activitySource: rand() > 0.45 ? 'wearable' : 'manual',
    activityLevel: pick(rand, ['light', 'moderate', 'very', 'extremely'] as const),
    macroGoals: macroGoalsFor(rand, goalType),
  };

  return { athlete, archetype, startWeightLb: startWeight };
}

export function buildMockDatabase(): MockDatabase {
  const rand = mulberry32(20260715);

  const jordan: Coach = { id: makeId('coach', rand), name: 'Jordan Reyes', email: 'jordan@uplate.dev' };
  const casey: Coach = { id: makeId('coach', rand), name: 'Casey Nguyen', email: 'casey@uplate.dev' };

  const teamWrestling: Team = {
    id: makeId('team', rand),
    name: 'Boilermaker Wrestling',
    coachIds: [jordan.id],
    athleteIds: [],
    inviteCode: makeInviteCode(rand),
    createdAt: daysAgoIso(140),
  };
  const teamXcWomen: Team = {
    id: makeId('team', rand),
    name: "Cross Country — Women's Distance",
    coachIds: [casey.id, jordan.id],
    athleteIds: [],
    inviteCode: makeInviteCode(rand),
    createdAt: daysAgoIso(95),
  };
  const teamXcMen: Team = {
    id: makeId('team', rand),
    name: "Cross Country — Men's Distance",
    coachIds: [casey.id],
    athleteIds: [],
    inviteCode: makeInviteCode(rand),
    createdAt: daysAgoIso(95),
  };

  const athletes: Athlete[] = [];
  const logsByAthlete = new Map<string, DailyLog[]>();
  const weightByAthlete = new Map<string, WeightEntry[]>();

  let globalIndex = 0;
  const teamRosterCounts: [Team, number][] = [
    [teamWrestling, 10],
    [teamXcWomen, 7],
    [teamXcMen, 7],
  ];

  for (const [team, count] of teamRosterCounts) {
    for (let i = 0; i < count; i++) {
      const { athlete, archetype, startWeightLb } = buildAthlete(rand, [team.id], globalIndex);
      athletes.push(athlete);
      team.athleteIds.push(athlete.id);
      logsByAthlete.set(athlete.id, generateLogs(rand, athlete.id, athlete.macroGoals, archetype));
      weightByAthlete.set(
        athlete.id,
        generateWeightHistory(rand, athlete.id, startWeightLb, athlete.goalWeightLb, archetype),
      );
      globalIndex++;
    }
  }

  const credentials = new Map<string, { coachId: string; password: string }>([
    ['jordan@uplate.dev', { coachId: jordan.id, password: 'coachdemo' }],
    ['casey@uplate.dev', { coachId: casey.id, password: 'coachdemo' }],
  ]);

  return {
    coaches: [jordan, casey],
    teams: [teamWrestling, teamXcWomen, teamXcMen],
    athletes,
    logsByAthlete,
    weightByAthlete,
    credentials,
  };
}
