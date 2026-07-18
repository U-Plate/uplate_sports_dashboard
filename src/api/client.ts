// Typed dashboard client. Pages depend on this interface, not on the
// concrete implementation, so a real HTTP-backed client can replace
// `local.ts` later without touching any component code.

import type { Athlete, AthleteDetailBundle, AthleteRosterRow, Coach, Team, Timeframe } from '../types';

export interface ApiClient {
  auth: {
    signIn(email: string, password: string): Promise<Coach>;
    signUp(input: { name: string; email: string; password: string }): Promise<Coach>;
    signOut(): Promise<void>;
    currentCoach(): Promise<Coach | null>;
  };
  teams: {
    listForCoach(coachId: string): Promise<Team[]>;
    create(coachId: string, name: string): Promise<Team>;
    get(teamId: string): Promise<Team | null>;
    regenerateInvite(teamId: string): Promise<Team>;
  };
  athletes: {
    get(athleteId: string): Promise<Athlete | null>;
    listRosterForTeam(teamId: string): Promise<AthleteRosterRow[]>;
    getDetail(athleteId: string, timeframe: Timeframe): Promise<AthleteDetailBundle | null>;
  };
}

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
