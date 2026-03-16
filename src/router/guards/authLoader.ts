import { redirect } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * 获取当前登录状态（在 loader 外使用，因 loader 运行在 React 之外）
 */
function getAuthState() {
  return useAuthStore.getState();
}

function createAuthLoader(): (args: { request: Request }) => Promise<ReturnType<typeof redirect> | null> {
  return async ({ request }) => {
    const { isAuthenticated } = getAuthState();

    if (!isAuthenticated) {
      const url = new URL(request.url);
      const from = url.pathname + url.search;
      return redirect(`/login?from=${encodeURIComponent(from)}`);
    }

    return null;
  };
}

function createLoginRedirectLoader(): (args: { request: Request }) => Promise<ReturnType<typeof redirect> | null> {
  return async ({ request }) => {
    const { isAuthenticated } = getAuthState();

    if (isAuthenticated) {
      const url = new URL(request.url);
      const from = url.searchParams.get('from');
      return redirect(from && from.startsWith('/') ? from : '/');
    }

    return null;
  };
}

/** 受保护路由的鉴权 loader */
export const authLoader = createAuthLoader();

/** 登录页 loader */
export const loginRedirectLoader = createLoginRedirectLoader();
