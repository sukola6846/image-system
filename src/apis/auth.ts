import type { RawAxiosResponseHeaders } from 'axios';
import { apiClient, parseBearerToken, readAuthorizationHeader } from './client';
import type { AuthUser } from './types';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

type LoginBody = {
  user: AuthUser;
};

type LoginWithHeaders = {
  data: LoginBody;
  headers: RawAxiosResponseHeaders;
};

/**
 * 登录：响应成功时
 * - token 从响应头 `Authorization: Bearer <token>` 读取
 * - user 从响应体 `data.user` 读取
 */
export async function login(params: LoginParams): Promise<LoginResult> {
  const res = await apiClient.post<LoginWithHeaders>('/auth/login', params, {
    skipAuth: true,
    withHeaders: true,
  });

  const token = parseBearerToken(readAuthorizationHeader(res.headers));
  if (!token) {
    throw new Error('响应未携带 Authorization: Bearer token');
  }

  return { token, user: res.data.user };
}
