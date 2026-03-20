import type { AuthUser } from './types';
import { apiClient } from './client';

export interface GetCurrentUserOptions {
  signal?: AbortSignal;
}

export function getCurrentUser(options?: GetCurrentUserOptions) {
  return apiClient.get<AuthUser>('/user/me', { signal: options?.signal });
}
