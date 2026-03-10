import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'auth-storage';

type Role = 'admin' | 'user';

interface AuthState {
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 用户 token（示例用，实际应从登录 API 获取） */
  token: string | null;
  /** 用户角色（示例用） */
  roles: Role[];
  /** 登录 */
  login: (token: string, roles?: Role[]) => void;
  /** 登出 */
  logout: () => void;
  /** 检查是否有指定权限/角色 */
  hasRole: (role: Role) => boolean;
  /** 检查是否有任一权限 */
  hasAnyRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      roles: [],

      login: (token, roles = []) => set({ isAuthenticated: true, token, roles }),

      logout: () => set({ isAuthenticated: false, token: null, roles: [] }),

      hasRole: (role) => get().roles.includes(role),

      hasAnyRole: (roles) => roles.length === 0 || roles.some((r) => get().roles.includes(r)),
    }),
    { name: AUTH_STORAGE_KEY }
  )
);
