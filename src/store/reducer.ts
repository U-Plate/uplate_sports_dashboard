import type { Team } from '../types';

export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

export const initialTeamsState: TeamsState = { teams: [], loading: true, error: null };

export type TeamsAction =
  | { type: 'LOADING' }
  | { type: 'SET_TEAMS'; teams: Team[] }
  | { type: 'ADD_TEAM'; team: Team }
  | { type: 'UPDATE_TEAM'; team: Team }
  | { type: 'ERROR'; message: string };

export function teamsReducer(state: TeamsState, action: TeamsAction): TeamsState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_TEAMS':
      return { teams: action.teams, loading: false, error: null };
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.team], loading: false };
    case 'UPDATE_TEAM':
      return {
        ...state,
        teams: state.teams.map((t) => (t.id === action.team.id ? action.team : t)),
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.message };
    default:
      return state;
  }
}
