import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Team } from '../types';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';
import { initialTeamsState, teamsReducer } from './reducer';

interface AppContextValue {
  teams: ReturnType<typeof teamsReducer>['teams'];
  loading: boolean;
  error: string | null;
  createTeam(name: string): Promise<Team>;
  regenerateInvite(teamId: string): Promise<void>;
  refetch(): Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { coach } = useAuth();
  const [state, dispatch] = useReducer(teamsReducer, initialTeamsState);

  const refetch = useCallback(async () => {
    if (!coach) return;
    dispatch({ type: 'LOADING' });
    try {
      const teams = await api.teams.listForCoach(coach.id);
      dispatch({ type: 'SET_TEAMS', teams });
    } catch {
      dispatch({ type: 'ERROR', message: "Couldn't load your teams. Try refreshing." });
    }
  }, [coach]);

  useEffect(() => {
    if (coach) void refetch();
  }, [coach, refetch]);

  const createTeam = useCallback(
    async (name: string) => {
      if (!coach) throw new Error('Not signed in');
      const team = await api.teams.create(coach.id, name);
      dispatch({ type: 'ADD_TEAM', team });
      return team;
    },
    [coach],
  );

  const regenerateInvite = useCallback(async (teamId: string) => {
    const team = await api.teams.regenerateInvite(teamId);
    dispatch({ type: 'UPDATE_TEAM', team });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ teams: state.teams, loading: state.loading, error: state.error, createTeam, regenerateInvite, refetch }),
    [state, createTeam, regenerateInvite, refetch],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
