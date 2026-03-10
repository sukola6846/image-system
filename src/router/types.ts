import type { RouteObject } from 'react-router-dom';

/**
 * 菜单配置：用于侧边栏菜单生成与权限过滤
 */
export interface RouteMenuMeta {
  /** 菜单显示文案 */
  label: string;
  /** Ant Design 图标名，如 PictureOutlined */
  icon?: string | React.ReactNode;
  /** 排序权重，数字越小越靠前 */
  order?: number;
  /** 是否在菜单中隐藏 */
  hide?: boolean;
  /** 父菜单的 key，用于生成子菜单: parentKey 表示这个路由在菜单里作为“可展开的父级”时使用的 key，用于控制 openKeys（哪个子菜单展开） */
  parentKey?: string;
}

/**
 * 动画配置：用于页面切换过渡效果
 */
export interface RouteAnimationMeta {
  /** 动画类型：fade | slide-left | slide-right | zoom */
  type?: 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'none';
  /** 持续时间（毫秒） */
  duration?: number;
}

/**
 * 路由 handle 元信息 - 涵盖所有功能元数据
 * 用于：页面标题、菜单生成、面包屑、缓存、权限、动画等
 */
export interface RouteHandle {
  /** 页面标题，用于 document.title */
  title: string;
  /** 菜单配置：icon、order、hide 等，用于自动生成侧边栏菜单 */
  menu?: RouteMenuMeta;
  /** 面包屑显示文案；支持函数以解析动态参数 */
  breadcrumb?: string | ((params: Record<string, string | undefined>) => string);
  /** 是否缓存页面（多标签页场景） */
  keepAlive?: boolean;
  /** 所需权限标识，空数组表示无需额外权限 */
  auth?: string[];
  /** 所需角色，空数组表示无角色限制 */
  roles?: string[];
  /** 动画配置，用于页面切换过渡 */
  animation?: RouteAnimationMeta;
  /** 是否在面包屑中隐藏 */
  breadcrumbHide?: boolean;
}

/**
 * 扩展 RouteObject，为 handle 提供完整类型
 */
export interface AppRouteObject extends Omit<RouteObject, 'children'> {
  handle?: RouteHandle;
  children?: AppRouteObject[];
}
