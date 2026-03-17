import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const SCROLL_CONTAINER_SELECTOR = '[data-scroll-container]';

/**
 * 路由切换时滚动重置
 * - PUSH/REPLACE 导航：滚动到顶部
 * - POP（浏览器前进/后退）：不干预，由 ScrollRestoration 恢复位置
 */
export function useScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const isPushOrReplace = navigationType === 'PUSH' || navigationType === 'REPLACE';
    const pathChanged = prevPathRef.current !== location.pathname;

    if (isPushOrReplace && pathChanged) {
      const container = document.querySelector(SCROLL_CONTAINER_SELECTOR);
      const target = (container ?? document.documentElement) as HTMLElement;
      target.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname, navigationType]);
}
