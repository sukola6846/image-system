import { useNavigate } from 'react-router-dom';

/**
 * 返回带 viewTransition 的 navigate，用于需要路由切换动画的跳转
 * 菜单、面包屑已单独处理，此 hook 供页面内 Link/按钮跳转使用
 */
export function useNavigateWithTransition() {
  const navigate = useNavigate();

  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      navigate(to);
      return;
    }
    navigate(to, { ...(options || {}), viewTransition: true });
  };
}
