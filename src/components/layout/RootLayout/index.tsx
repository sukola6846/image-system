import { Outlet, ScrollRestoration } from 'react-router-dom';
import { NavigationProgress } from '@/components/NavigationProgress';
import { useScrollToTop } from '@/router/hooks/useScrollToTop';

/**
 * 根布局：包裹所有路由，挂载全局顶部进度条与滚动恢复
 * 路由切换（loader/Form submit）时自动显示进度条
 * ScrollRestoration 用于恢复浏览器前进/后退时的滚动位置
 * useScrollToTop 用于 Link/navigate 切换时滚动到顶部
 */
export function RootLayout() {
  useScrollToTop();

  return (
    <>
      <ScrollRestoration />
      {/* 全局顶部进度条 */}
      <NavigationProgress />
      <Outlet />
    </>
  );
}
