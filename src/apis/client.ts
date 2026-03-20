import axios, {
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  isAxiosError,
  type RawAxiosResponseHeaders,
} from 'axios';
import { message } from 'antd';
import type { ApiResponse } from './types';
import { useAuthStore } from '@/stores/authStore';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 为 true 时不自动附加 Authorization（例如：登录请求）
     * 默认 false：会尝试从 authStore 注入 token
     */
    skipAuth?: boolean;
    /**
     * 为 true 时：业务错误（HTTP 200 且 code !== 0）不弹出 message
     * 注意：HTTP 5xx 始终需要弹出错误提示
     */
    silent?: boolean;
    /**
     * 为 true 时：成功时返回 { data, headers }，用于按需读取响应头
     * 默认 false：拦截器会解包并只返回 data
     */
    withHeaders?: boolean;
  }
}

export class ApiBusinessError extends Error {
  readonly code: number;

  constructor(messageText: string, code: number) {
    super(messageText);
    this.name = 'ApiBusinessError';
    this.code = code;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const rawClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 token
rawClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
});

// 响应拦截器：解包 { code, data, message }
rawClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { config, status, data, headers } = response;

    // 非 2xx 一般不会走到这里（axios 会 reject），保守处理
    if (status < 200 || status >= 300) return response;

    // 如果后端没返回约定结构，这里就直接把原始 data 当作业务 data
    if (!data || typeof data !== 'object' || !('code' in data)) {
      return (config.withHeaders ? { data, headers } : data) as unknown as AxiosResponse<unknown>;
    }

    const body = data as ApiResponse<unknown>;
    if (body.code !== 0) {
      if (!config.silent) {
        message.error(body.message || '请求失败');
      }
      return Promise.reject(new ApiBusinessError(body.message || '请求失败', body.code));
    }

    if (config.withHeaders) {
      return { data: body.data, headers } as unknown as AxiosResponse<unknown>;
    }

    return body.data as unknown as AxiosResponse<unknown>;
  },
  (error: unknown) => {
    // 业务 code 错误（在成功拦截器里 reject 的情况）
    if (error instanceof ApiBusinessError) {
      return Promise.reject(error);
    }

    if (!isAxiosError(error) || !error.response) {
      message.error('网络异常，请检查网络');
      return Promise.reject(error);
    }

    const { status, data, config } = error.response;

    const silent = Boolean((config as InternalAxiosRequestConfig).silent);

    const bodyMessage =
      data && typeof data === 'object' && 'message' in data ? String((data as { message: string }).message) : '';

    // HTTP 5xx：无条件弹出错误提示（不受 silent 影响）
    if (status >= 500) {
      message.error(bodyMessage || '服务器错误，请稍后重试');
      return Promise.reject(error);
    }

    if (status === 401) {
      useAuthStore.getState().logout();
      message.error('登录已过期，请重新登录');
      const from = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?from=${from}`;
      return Promise.reject(error);
    }

    if (status === 403) {
      message.error(bodyMessage || '没有权限访问');
      return Promise.reject(error);
    }

    // 其它 HTTP 错误：默认弹出（除非业务方希望 silent 用于 code !== 0）
    // 这里不复用 silent（因为 silent 的语义限定为 business code）
    if (!silent) {
      message.error(bodyMessage || `请求失败 (${status})`);
    }
    return Promise.reject(error);
  }
);

/**
 * 将拦截器解包后的 rawClient 包一层类型，使 get/post 返回 Promise<T>
 * （当 withHeaders = true 时，由业务在调用处自行按 { data, headers } 解构）
 */
export type ApiClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

export const apiClient = rawClient as unknown as ApiClient;

/** 从响应头解析 Bearer token（给 login 使用） */
export function parseBearerToken(authorization?: string | null): string | null {
  if (!authorization) return null;
  const m = /^Bearer\s+(.+)$/i.exec(String(authorization).trim());
  return m?.[1] ?? null;
}

/** 兼容 axios headers 大小写：尽量读取 authorization */
export function readAuthorizationHeader(headers: RawAxiosResponseHeaders): string | null {
  const h = headers as unknown as {
    get?: (k: string) => unknown;
    authorization?: unknown;
    Authorization?: unknown;
  };

  if (typeof h.get === 'function') {
    const v1 = h.get('authorization');
    if (typeof v1 === 'string') return v1;
    const v2 = h.get('Authorization');
    if (typeof v2 === 'string') return v2;
  }

  const raw = h.authorization ?? h.Authorization;
  return typeof raw === 'string' ? raw : null;
}
