import { useMatches } from 'react-router-dom';
import type { RouteAnimationMeta } from '../types';

const DEFAULT_ANIMATION: RouteAnimationMeta = {
  type: 'fade',
  duration: 200,
};

interface MatchWithHandle {
  handle?: { animation?: RouteAnimationMeta };
}

/**
 * 从当前匹配路由链中获取叶子路由的 handle.animation 配置
 * 若未配置则返回默认 fade 动画
 */
export function useRouteAnimation(): RouteAnimationMeta {
  const matches = useMatches() as MatchWithHandle[];
  for (let i = matches.length - 1; i >= 0; i--) {
    const anim = matches[i].handle?.animation;
    if (anim) {
      if (anim.type === 'none') {
        return { type: 'none', duration: 0 };
      }
      return {
        type: anim.type ?? 'fade',
        duration: anim.duration ?? 200,
      };
    }
  }
  return DEFAULT_ANIMATION;
}

export const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;
