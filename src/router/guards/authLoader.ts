import { redirect } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * 获取当前登录状态（在 loader 外使用，因 loader 运行在 React 之外）
 */
function getAuthState() {
  return useAuthStore.getState();
}

/**
 * 受保护路由的鉴权 loader
 * 未登录时重定向到 /login，并记录回跳地址
 */
export function authLoader({ request }: { request: Request }) {
  const { isAuthenticated } = getAuthState();

  if (!isAuthenticated) {
    const url = new URL(request.url);
    const from = url.pathname + url.search;
    return redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  return null;
}

/**
 * 登录页 loader：已登录时重定向到首页或回跳地址
 */
export function loginRedirectLoader({ request }: { request: Request }) {
  const { isAuthenticated } = getAuthState();

  if (isAuthenticated) {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    return redirect(from && from.startsWith('/') ? from : '/');
  }

  return null;
}
