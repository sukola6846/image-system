import { Link, useMatches } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import type { RouteHandle } from '@/router/types';

interface MatchWithHandle {
  pathname: string;
  params: Record<string, string | undefined>;
  handle?: RouteHandle;
}

/**
 * 从 handle.breadcrumb 生成面包屑文案
 * 支持字符串或函数（动态参数如 :id）
 */
function getBreadcrumbLabel(handle: RouteHandle, params: Record<string, string | undefined>): string {
  const { breadcrumb } = handle;
  if (!breadcrumb) return '';
  return typeof breadcrumb === 'function' ? breadcrumb(params) : breadcrumb;
}

interface RouteBreadcrumbProps {
  className?: string;
}

/**
 * 基于路由 handle.breadcrumb 的面包屑
 * - 展示当前页面层级
 * - 点击可跳转到对应路由（最后一层不可点击）
 */
export function RouteBreadcrumb({ className }: RouteBreadcrumbProps) {
  const matches = useMatches() as MatchWithHandle[];

  const items = matches
    .filter((match) => match.handle?.breadcrumb && !match.handle.breadcrumbHide)
    .map((match, index, arr) => {
      const label = getBreadcrumbLabel(match.handle!, match.params);
      const isLast = index === arr.length - 1;

      return {
        key: match.pathname + index,
        title: isLast ? (
          label
        ) : (
          <Link to={match.pathname} viewTransition className="breadcrumb-link">
            {label}
          </Link>
        ),
      };
    });

  if (items.length === 0) return null;

  return <Breadcrumb className={className} items={items} />;
}
