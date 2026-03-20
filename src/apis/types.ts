/** 后端统一响应体 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export type Role = 'admin' | 'user' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  roles: Role[];
  permissions: string[];
}
