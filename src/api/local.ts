import type {
  Athlete,
  AthleteDetailBundle,
  AthleteRosterRow,
  Coach,
  DailyLog,
  MacroTotals,
  Team,
  Timeframe,
} from '../types';
import { buildMockDatabase } from '../data/mockSeed';
import { daysAgoIso, todayIso } from '../lib/date';
import { makeId, makeInviteCode } from '../lib/id';
import { computeAthleteStatus } from '../lib/status';
import { computeGoalWeightProjection } from '../lib/weightProjection';
import type { ApiClient } from './client';
import { ApiError } from './client';

const STORAGE_KEY = 'uplate-sports-dashboard:v1';
const SEASON_WINDOW_DAYS = 30;
const NETWORK_DELAY_MS = 220;

interface Persisted {
  sessionCoachId: string | null;
  newCoaches: Coach[];
  newCredentials: Record<string, { coachId: string; password: string }>;
  newTeams: Team[];
  inviteOverrides: Record<string, string>;
}

function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('empty');
    return JSON.parse(raw) as Persisted;
  } catch {
    return { sessionCoachId: null, newCoaches: [], newCredentials: {}, newTeams: [], inviteOverrides: {} };
  }
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));
}

function emptyTotals(): MacroTotals {
  return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
}

function sumLog(log: DailyLog | undefined): MacroTotals {
  if (!log) return emptyTotals();
  return log.meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    emptyTotals(),
  );
}

export function createLocalClient(): ApiClient {
  const seed = buildMockDatabase();
  const persisted = loadPersisted();

  const coaches = [...seed.coaches, ...persisted.newCoaches];
  const teams = [...seed.teams, ...persisted.newTeams];
  const athletes = [...seed.athletes];
  const credentials = new Map(seed.credentials);
  for (const [email, cred] of Object.entries(persisted.newCredentials)) credentials.set(email, cred);
  for (const [teamId, code] of Object.entries(persisted.inviteOverrides)) {
    const team = teams.find((t) => t.id === teamId);
    if (team) team.inviteCode = code;
  }

  let sessionCoachId: string | null = persisted.sessionCoachId;

  function persist() {
    const state: Persisted = {
      sessionCoachId,
      newCoaches: coaches.filter((c) => !seed.coaches.some((s) => s.id === c.id)),
      newCredentials: Object.fromEntries(
        [...credentials.entries()].filter(([email]) => !seed.credentials.has(email)),
      ),
      newTeams: teams.filter((t) => !seed.teams.some((s) => s.id === t.id)),
      inviteOverrides: Object.fromEntries(teams.map((t) => [t.id, t.inviteCode])),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function requireAthlete(athleteId: string): Athlete {
    const athlete = athletes.find((a) => a.id === athleteId);
    if (!athlete) throw new ApiError('athlete_not_found', 'Athlete not found.');
    return athlete;
  }

  function rosterRowFor(athlete: Athlete): AthleteRosterRow {
    const logs = seed.logsByAthlete.get(athlete.id) ?? [];
    const today = todayIso();
    const { status, reason, lastLoggedDate } = computeAthleteStatus(logs, athlete.macroGoals, today);
    return { athlete, status, statusReason: reason, lastLoggedDate };
  }

  const client: ApiClient = {
    auth: {
      async signIn(email, password) {
        await delay(null);
        const cred = credentials.get(email.trim().toLowerCase());
        if (!cred || cred.password !== password) {
          throw new ApiError('invalid_credentials', "That email and password don't match our records.");
        }
        sessionCoachId = cred.coachId;
        persist();
        const coach = coaches.find((c) => c.id === cred.coachId);
        if (!coach) throw new ApiError('coach_not_found', 'Coach record is missing.');
        return coach;
      },
      async signUp({ name, email, password }) {
        await delay(null);
        const normalized = email.trim().toLowerCase();
        if (credentials.has(normalized)) {
          throw new ApiError('email_taken', 'An account already exists with that email.');
        }
        const coach: Coach = { id: makeId('coach'), name: name.trim(), email: normalized };
        coaches.push(coach);
        credentials.set(normalized, { coachId: coach.id, password });
        sessionCoachId = coach.id;
        persist();
        return coach;
      },
      async signOut() {
        await delay(null);
        sessionCoachId = null;
        persist();
      },
      async currentCoach() {
        await delay(null);
        if (!sessionCoachId) return null;
        return coaches.find((c) => c.id === sessionCoachId) ?? null;
      },
    },

    teams: {
      async listForCoach(coachId) {
        await delay(null);
        return teams.filter((t) => t.coachIds.includes(coachId));
      },
      async create(coachId, name) {
        await delay(null);
        const team: Team = {
          id: makeId('team'),
          name: name.trim(),
          coachIds: [coachId],
          athleteIds: [],
          inviteCode: makeInviteCode(),
          createdAt: todayIso(),
        };
        teams.push(team);
        persist();
        return team;
      },
      async get(teamId) {
        await delay(null);
        return teams.find((t) => t.id === teamId) ?? null;
      },
      async regenerateInvite(teamId) {
        await delay(null);
        const team = teams.find((t) => t.id === teamId);
        if (!team) throw new ApiError('team_not_found', 'Team not found.');
        team.inviteCode = makeInviteCode();
        persist();
        return team;
      },
    },

    athletes: {
      async get(athleteId) {
        await delay(null);
        return athletes.find((a) => a.id === athleteId) ?? null;
      },
      async listRosterForTeam(teamId) {
        await delay(null);
        const team = teams.find((t) => t.id === teamId);
        if (!team) return [];
        const severity: Record<string, number> = { 'off-track': 0, attention: 1, 'not-logging': 2, 'on-track': 3 };
        return team.athleteIds
          .map((id) => athletes.find((a) => a.id === id))
          .filter((a): a is Athlete => Boolean(a))
          .map(rosterRowFor)
          .sort((a, b) => severity[a.status] - severity[b.status]);
      },
      async getDetail(athleteId, timeframe: Timeframe) {
        await delay(null);
        const athlete = requireAthlete(athleteId);
        const logs = seed.logsByAthlete.get(athleteId) ?? [];
        const weightHistory = seed.weightByAthlete.get(athleteId) ?? [];
        const today = todayIso();
        const byDate = new Map(logs.map((l) => [l.date, l]));

        const { status, reason } = computeAthleteStatus(logs, athlete.macroGoals, today);
        const todayTotals = sumLog(byDate.get(today));

        const windowDays = timeframe === 'today' ? 1 : timeframe === 'week' ? 7 : SEASON_WINDOW_DAYS;
        const days = Array.from({ length: windowDays }, (_, i) => daysAgoIso(windowDays - 1 - i, new Date(`${today}T00:00:00`)));
        const dayBreakdowns = days.map((date) => ({
          date,
          totals: sumLog(byDate.get(date)),
          meals: byDate.get(date)?.meals ?? [],
        }));
        const rangeTotals = dayBreakdowns.reduce(
          (acc, d) => ({
            calories: acc.calories + d.totals.calories,
            proteinG: acc.proteinG + d.totals.proteinG,
            carbsG: acc.carbsG + d.totals.carbsG,
            fatG: acc.fatG + d.totals.fatG,
          }),
          emptyTotals(),
        );

        const sortedWeights = [...weightHistory].sort((a, b) => (a.date < b.date ? -1 : 1));
        const currentWeightLb = sortedWeights.length ? sortedWeights[sortedWeights.length - 1].weightLb : null;
        const projection = computeGoalWeightProjection(weightHistory, athlete.goalWeightLb, today);

        const bundle: AthleteDetailBundle = {
          athlete,
          status,
          statusReason: reason,
          currentWeightLb,
          today: { totals: todayTotals, meals: byDate.get(today)?.meals ?? [] },
          range: { timeframe, totals: rangeTotals, days: dayBreakdowns },
          weightHistory: sortedWeights,
          projection,
        };
        return bundle;
      },
    },
  };

  return client;
}
