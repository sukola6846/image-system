# 路由动画设计方案

> 基于 React Router 7.13 + View Transitions API 的路由切换过渡效果设计

---

## 一、技术选型

### 1.1 选用 View Transitions API（RR v7 原生支持）

| 对比项        | View Transitions API                                | Framer Motion           |
| ------------- | --------------------------------------------------- | ----------------------- |
| 依赖          | 无，RR v7 内置                                      | framer-motion ~60-100KB |
| 与 RR v7 集成 | 原生支持 `viewTransition`、`useViewTransitionState` | 需配合 useOutlet 等封装 |
| 性能          | 浏览器原生，GPU 加速                                | JS 驱动，复杂动画有开销 |
| 学习成本      | 低，配置即可                                        | 中等                    |
| 浏览器支持    | Chrome 111+、Safari 18+、Firefox 144+               | 主流浏览器              |

**结论**：优先使用 View Transitions API，零依赖、性能好、与现有 route 元信息（`handle.animation`）可结合。

### 1.2 浏览器支持与降级策略

```
Chrome 111+、Edge 111+  ✅ 完整支持
Safari 18+、Firefox 144+ ✅ 支持
旧版浏览器              → 无动画，直接切换（可接受）
```

- **不引入 polyfill**：后台系统，旧版浏览器占比低，无动画可接受
- **可扩展**：后续若需兼容，可接入 `view-transitions-polyfill`

---

## 二、整体架构

### 2.1 数据流

```
routeDefinitions (handle.animation)
        ↓
    AdminLayout
        ↓
  useRouteAnimation()  ← 获取当前路由动画配置
        ↓
  AnimatedOutlet       ← 包裹 <Outlet />，应用 view-transition-name / CSS
        ↓
   Link / navigate     ← viewTransition: true 触发过渡
```

### 2.2 与现有类型的衔接

`RouteHandle.animation` 已定义：

```ts
interface RouteAnimationMeta {
  type?: 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'none';
  duration?: number;
}
```

- `type: 'none'`：不应用过渡
- `type` 未配置：使用全局默认（如 `fade`）
- `duration`：过渡时长，映射为 CSS `animation-duration`

---

## 三、实现方案

### 3.1 启用方式

**方案 A：全局启用（推荐）**

在 AdminLayout 的 `<Outlet />` 外包一层 `AnimatedOutlet`，所有子路由默认带过渡。导航触发方式：

1. **菜单点击**：`navigate(path, { viewTransition: true })`
2. **面包屑点击**：`<Link to={path} viewTransition>`
3. **页面内跳转**：`navigate(path, { viewTransition: true })` 或 `<Link viewTransition>`

**方案 B：按需启用**

仅在需要动画的 `Link`/`navigate` 上添加 `viewTransition`。菜单、面包屑等统一封装为使用 `viewTransition` 的导航组件。

### 3.2 组件职责划分

| 模块                     | 职责                                                                             |
| ------------------------ | -------------------------------------------------------------------------------- |
| `AnimatedOutlet`         | 包裹 Outlet，根据 `handle.animation` 设置 `view-transition-name`、应用动画 class |
| `useRouteAnimation`      | 从 `useMatches()` 取当前路由的 `handle.animation`                                |
| `navigateWithTransition` | 封装 `navigate(path, { viewTransition: true })`，供菜单、面包屑等复用            |
| 全局 CSS                 | 定义 `.vt-fade`、`.vt-slide-left` 等动画样式                                     |

### 3.3 动画类型与 CSS 映射

| type          | view-transition-name | 动画效果     |
| ------------- | -------------------- | ------------ |
| `fade`        | `page-main`          | 透明度渐变   |
| `slide-left`  | `page-main`          | 自右向左滑入 |
| `slide-right` | `page-main`          | 自左向右滑入 |
| `zoom`        | `page-main`          | 缩放入场     |
| `none`        | -                    | 无过渡       |

通过 `view-transition-name: page-main` 统一命名，配合 `::view-transition-old(page-main)` 和 `::view-transition-new(page-main)` 的 `animation` 定义不同效果。

### 3.4 动画时长

- `duration` 传入毫秒，转换为 `animation-duration: ${duration}ms`
- 未配置时使用默认值（如 200ms）

---

## 四、目录结构

```
src/
├── components/
│   └── AnimatedOutlet/
│       ├── index.tsx          # 动画出口组件
│       └── index.module.scss  # 动画样式（或放全局）
├── router/
│   └── hooks/
│       └── useRouteAnimation.ts  # 获取当前路由 animation 配置
├── styles/
│   └── view-transitions.scss    # View Transitions 全局样式（可选）
```

---

## 五、配置示例

### 5.1 路由定义

```ts
// 默认 fade，200ms
{
  path: 'images',
  handle: {
    animation: { type: 'fade', duration: 200 },
    // ...
  },
}

// 详情页使用 slide-left
{
  path: 'detail/:id',
  handle: {
    animation: { type: 'slide-left', duration: 250 },
    // ...
  },
}

// 上传页不使用动画
{
  path: 'upload',
  handle: {
    animation: { type: 'none' },
    // ...
  },
}
```

### 5.2 全局默认

在 `useRouteAnimation` 中，若当前路由无 `handle.animation`，返回：

```ts
{ type: 'fade', duration: 200 }
```

---

## 六、CSS 动画定义（核心）

```scss
// 基于 view-transition-name: page-main

::view-transition-old(page-main) {
  animation: vt-fade-out var(--vt-duration, 200ms) ease-out forwards;
}

::view-transition-new(page-main) {
  animation: vt-fade-in var(--vt-duration, 200ms) ease-out forwards;
}

// type=slide-left 时
[data-vt='slide-left'] {
  --vt-duration: 250ms;

  &::view-transition-old(page-main) {
    animation: vt-slide-out-left var(--vt-duration) ease-out forwards;
  }

  &::view-transition-new(page-main) {
    animation: vt-slide-in-left var(--vt-duration) ease-out forwards;
  }
}
```

通过 `data-vt` 属性切换不同动画类型。

---

## 七、实施步骤

| 阶段 | 任务                                       | 说明                                                |
| ---- | ------------------------------------------ | --------------------------------------------------- |
| P1   | 封装 `navigateWithTransition` / 统一 Link  | 菜单、面包屑等统一使用带过渡的导航                  |
| P2   | 实现 `useRouteAnimation`                   | 从 matches 取 `handle.animation`                    |
| P3   | 实现 `AnimatedOutlet`                      | 包裹 Outlet，设置 `view-transition-name`、`data-vt` |
| P4   | 编写全局 View Transitions CSS              | fade、slide-left、slide-right、zoom                 |
| P5   | 在 routeDefinitions 中按需配置 `animation` | 默认 fade，特殊页面可覆盖                           |

---

## 八、可选扩展

### 8.1 共享元素过渡

若需「图片列表 → 图片详情」的共享元素（如图片平滑放大），可对目标元素设置 `view-transition-name`，与 RR 的 `useViewTransitionState` 配合。复杂度较高，建议作为后续迭代。

### 8.2 降级检测

```ts
const supportsViewTransitions = 'startViewTransition' in document;
// 不支持时，navigate 不传 viewTransition，避免报错
```

### 8.3 与 Framer Motion 的切换

若后续需要更复杂动画，可将 `AnimatedOutlet` 内部实现切换为 Framer Motion 的 `AnimatePresence` + `motion.div`，对外接口保持不变（仍读取 `handle.animation`）。

---

_文档版本：v1.0 | 更新日期：2025-03_
