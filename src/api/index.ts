// Single import point for pages:
//
//   import { api } from '../api';
//
// Only the local mock client exists today, since the real backend has no
// coach/team/roster endpoints yet. This file is the intended swap-in point:
// a future `createHttpClient({ baseUrl, getAuthToken })` (see the sibling
// UPlate Restaurant Dashboard's api/http.ts for the pattern) can replace
// `createLocalClient()` below without any page or component changes, since
// everything here depends on the `ApiClient` interface, not this file.

import type { ApiClient } from './client';
import { createLocalClient } from './local';

export type { ApiClient } from './client';
export { ApiError } from './client';
export * from '../types';

let _client: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!_client) _client = createLocalClient();
  return _client;
}

export const api: ApiClient = new Proxy({} as ApiClient, {
  get(_target, prop) {
    const client = getApiClient() as unknown as Record<string | symbol, unknown>;
    return client[prop as keyof ApiClient];
  },
});
