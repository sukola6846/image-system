import { Outlet } from 'react-router-dom';
import { NavigationProgress } from '@/components/NavigationProgress';

/**
 * 根布局：包裹所有路由，挂载全局顶部进度条
 * 路由切换（loader/Form submit）时自动显示
 */
export function RootLayout() {
  return (
    <>
      {/* 全局顶部进度条 */}
      <NavigationProgress />
      <Outlet />
    </>
  );
}
