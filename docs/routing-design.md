# 项目路由实现方案及功能设计

> 基于 React Router 7.13 的完整路由架构设计文档

---

## 一、基础选型

**选择：React Router 7.13**

- 与 React 19 兼容，Data Router 模式原生支持 `createBrowserRouter`
- 提供 `loader`、`action`、`errorElement` 等数据 API
- 路由对象可配置 `handle` 扩展元信息
- v7 从 v6 升级为非破坏性，可渐进式迁移

**安装**：`pnpm add react-router-dom@^7.13`

---

## 二、路由结构设计

### 2.1 结构层次

```
/                           # 根路由（无 UI）
├── /login                  # 公共路由 - 登录页
└── /                       # 受保护布局根
    ├── (index)             # 索引路由 → 仪表盘
    ├── /images             # 图片管理
    │   ├── (index)         # 图片列表
    │   ├── /upload         # 上传
    │   └── /trash          # 回收站
    ├── /settings           # 系统设置
    └── *                   # 404 捕获
```

### 2.2 嵌套路由

- 使用 `children` 定义嵌套关系
- 父路由用 `<Outlet />` 渲染子路由
- 布局组件（如 `AdminLayout`）作为父 route 的 `element`，内部渲染 `<Outlet />`

### 2.3 索引路由

- `index: true` 或 `path: ""` + `index: true` 表示该路由渲染父路径的默认子页面
- 例：`/` 的 index 路由对应仪表盘

### 2.4 404 捕获

- 使用 `path: "*"` 或 `path: "/*"` 作为兜底路由
- 渲染 `NotFound` 组件，可提供返回首页/上一页等操作

### 2.5 错误捕获

- 每个 route 可配置 `errorElement`
- 当该路由及其子路由的 `loader` 或组件抛出错误时，渲染 `errorElement`
- 建议在根路由和关键布局层配置，实现错误冒泡与分级处理

### 2.6 权限路由与公共路由

| 类型        | 说明                | 布局                 |
| ----------- | ------------------- | -------------------- |
| 公共路由    | `/login` 等无需登录 | 独立全屏布局或无布局 |
| 受保护路由  | 需登录/权限验证     | AdminLayout          |
| 404 / Error | 兜底                | 简约布局或全屏       |

通过**路由守卫**在进入受保护路由前进行鉴权，未通过则 `redirect('/login')`。

---

## 三、代码分割

### 3.1 实现方式

- 使用 `React.lazy()` 包裹页面组件
- 路由配置中 `element` 传入 `lazy` 组件，并由 `Suspense` 包裹

### 3.2 自定义 Fallback

- 在布局层或根层使用 `<Suspense fallback={<PageSkeleton />}>` 包裹 `<Outlet />`
- Fallback 可区分层级：根级用全局 loading，子级用页面级 skeleton
- 建议抽离统一的 `RouteFallback` 组件，支持 props 自定义样式

### 3.3 示例

```tsx
const Home = lazy(() => import('@/pages/home'));
// 路由配置
{ path: '/', element: <Suspense fallback={<PageSkeleton />}><Home /></Suspense> }
```

或使用 `createBrowserRouter` 配合 `element` 时，在父布局统一包一层 Suspense。

---

## 四、权限控制

### 4.1 路由守卫机制

**方案 A：在 loader 中做鉴权（推荐）**

- 为受保护路由配置 `loader`，内部校验登录/角色
- 未通过时 `throw redirect('/login')`
- 可抽离 `authLoader` 高阶函数复用

**方案 B：包装布局组件**

- 创建 `ProtectedLayout`，内部用 `useEffect` + `navigate` 做重定向
- 缺点：会有短暂闪烁，不如 loader 在渲染前拦截干净

**推荐**：以 loader 为主，必要时在组件内做二次校验。

### 4.2 角色/权限验证

- 在 loader 中调用权限服务，根据 `params`、`request.url` 等判断
- 支持 `handle.auth` 或 `handle.roles` 声明所需权限，在通用 loader 中统一解析
- 未授权可 `throw redirect('/403')` 或渲染 403 页面

### 4.3 未授权处理

- 401 → 重定向到 `/login`，并通过 `location.state.from` 或 search 记录回跳地址
- 403 → 渲染无权限页或重定向到无权限提示页

### 4.4 动态路由加载

- 根据用户权限过滤 route 配置，只渲染有权限的 `children`
- 可维护「完整路由树」与「权限过滤函数」，在应用初始化时生成最终 routes
- 或后端返回有权限的 path 列表，前端据此组装路由

---

## 五、路由元信息

### 5.1 使用 handle 扩展

React Router 的 `handle` 是官方推荐的扩展方式，可在 route 上挂载任意元数据：

```ts
{
  path: '/images',
  handle: {
    title: '图片管理',
    menu: { icon: 'PictureOutlined', order: 2 },
    breadcrumb: '图片管理',
    keepAlive: true,
  },
}
```

### 5.2 建议的 meta 字段

| 字段         | 类型               | 说明                            |
| ------------ | ------------------ | ------------------------------- |
| `title`      | string             | 页面标题，用于 document.title   |
| `menu`       | object             | 菜单配置：icon、order、hide 等  |
| `breadcrumb` | string \| function | 面包屑显示文案或生成函数        |
| `keepAlive`  | boolean            | 是否缓存（若实现多标签/缓存页） |
| `auth`       | string[]           | 所需权限标识                    |
| `roles`      | string[]           | 所需角色                        |

### 5.3 读取方式

- `useMatches()` 获取当前匹配的路由列表，从中取 `handle`
- 可封装 `useRouteMeta()` 方便使用

---

## 六、数据预加载

### 6.1 Loader 与 useLoaderData

- 在 route 上配置 `loader`，在组件挂载前执行
- 组件内通过 `useLoaderData()` 获取数据
- 适合「进入页面必须有的数据」，可避免 loading 闪烁

### 6.2 errorElement

- loader 抛出异常时，由最近父级的 `errorElement` 捕获
- 可 `throw new Response('', { status: 404 })` 触发 404 处理
- 可 `throw redirect(path)` 做重定向

### 6.3 取舍建议

- **推荐使用**：关键列表页、详情页、仪表盘等强数据依赖页面
- **可不使用**：纯 UI 页、表单页等可组件内请求的场景
- 若暂不引入 loader，可先预留接口，后续按页面逐步接入

---

## 七、导航守卫

### 7.1 全局前置守卫

- **实现**：在根 layout 的 `loader` 或根 route 的 `loader` 中做统一校验
- 或使用 React Router 的 `beforeLoad`（若将来提供）做全局钩子
- 当前可封装 `createProtectedLoader(loader)` 包装需要鉴权的 loader

### 7.2 离开确认（动态启用）

- 使用 `useBlocker` 或 `unstable_useBlocker`（视版本而定）
- 在表单页、编辑页根据 `isDirty` 等状态动态设置 `blocker`，弹出确认对话框
- 封装 `useLeaveConfirm({ when, message })` 便于复用

```tsx
// React Router 7 中 blocker 的用法
const blocker = useBlocker(
  ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
);
// blocker.state === 'blocked' 时显示确认框
```

### 7.3 动态启用

- 通过 props 或 context 控制 `when` 条件，仅在需要时拦截
- 避免在无关页面触发 blocker，影响性能与体验

---

## 八、路由动画

### 8.1 实现思路

- 在布局组件的 `<Outlet />` 外包一层动画容器
- 路由切换时，Outlet 内容变化，触发进入/退出动画

### 8.2 依赖选型

| 方案                       | 优点                                  | 缺点                     |
| -------------------------- | ------------------------------------- | ------------------------ |
| **framer-motion**          | API 丰富、动画能力强、与 React 集成好 | 包体积较大               |
| **react-transition-group** | 轻量、可控                            | 需手写 CSS，能力相对基础 |

**推荐**：若项目已有或计划使用复杂动效，选 **framer-motion**；若只做简单 fade/slide，可用 **react-transition-group** 减小体积。

### 8.3 实现要点

- 使用 `AnimatePresence`（framer-motion）或 `TransitionGroup`（react-transition-group）包裹 `Outlet`
- 为 Outlet 的 key 使用 `location.pathname`，保证切换时正确触发 exit
- 支持通过 `handle.animation` 为不同路由配置不同动画

---

## 九、面包屑导航

### 9.1 自动生成

- 从 `useMatches()` 获取当前匹配路由
- 遍历 `matches`，读取每个 route 的 `handle.breadcrumb` 或 `handle.title`
- 动态参数（如 `:id`）可用 `params` 替换，生成「项目详情 - xxx」等形式

### 9.2 动态参数解析

- `handle.breadcrumb` 可设为函数：`(params) => params.id ? `详情-${params.id}` : '列表'`
- 或结合 loader 返回的数据生成文案
- 封装 `Breadcrumb` 组件，内部消费 `useMatches()` 和 `useParams()`

---

## 十、菜单生成

### 10.1 从路由配置生成

- 遍历路由树，筛选 `handle.menu !== false` 的节点
- 根据 `handle.menu.order` 排序，`handle.menu.icon` 映射图标
- 有 `children` 的 route 生成子菜单

### 10.2 权限过滤

- 与权限系统结合，过滤掉用户无权限访问的菜单项
- 若使用动态路由，菜单与路由同源，天然一致
- 可维护 `path → 权限码` 映射表，在生成菜单时做过滤

### 10.3 与现有 menuConfig 的关系

- 可将 `menuConfig` 迁移为「由路由配置导出」
- 或保留 menuConfig 作为兜底，路由 handle 优先，实现渐进迁移

---

## 十一、路由参数处理

### 11.1 路径参数（:id）

- 在 route 的 `path` 中定义，如 `path: 'images/:id'`
- 组件内通过 `useParams()` 获取
- loader 的 `({ params })` 中也可使用

### 11.2 查询参数（?tab=1）

- 使用 `useSearchParams()` 读写
- 适合筛选、分页、tab 等场景

### 11.3 状态传递（location.state）

- 通过 `navigate(path, { state: { from: 'xxx' } })` 传递
- 组件内通过 `useLocation().state` 读取
- 适合「从列表跳详情再返回」的回跳、临时数据传递

### 11.4 职责划分

- **路由层**：path 设计、params 定义、重定向逻辑
- **页面层**：searchParams 解析、state 使用、业务逻辑
- 建议封装 `usePageQuery<T>()`、`useLocationState<T>()` 等 hook，统一解析与类型约束

---

## 十二、重定向与导航

### 12.1 默认重定向

- `/` 索引路由直接渲染仪表盘
- 或配置 `{ path: '/', element: <Navigate to="/dashboard" replace /> }`

### 12.2 登录后回跳

- 未登录访问受保护页时，`redirect(\`/login?from=${encodeURIComponent(path)}\`)`
- 登录成功后读取 `searchParams.get('from')` 或 `location.state.from`，`navigate(from ?? '/')`

### 12.3 404 处理

- `path: "*"` 渲染 NotFound
- loader 中 `throw new Response('', { status: 404 })` 会由 errorElement 或专用 404 逻辑处理

---

## 十三、路由模块化

### 13.1 按功能拆分

```
src/
  routes/
    index.tsx          # 组装所有路由
    public.tsx         # 登录等公共路由
    admin.tsx          # 后台嵌套路由
    lazy.ts            # lazy 组件导出
```

### 13.2 异步加载

- 路由配置本身可用动态 import：`const adminRoutes = await import('./admin').then(m => m.routes)`
- 或使用 `lazy` 的 `element`，路由配置保持同步，仅组件异步加载
- 推荐：配置同步，组件 lazy，便于类型推断和构建分析

---

## 十四、错误边界

### 14.1 路由级 errorElement

- 每个 route 可配置 `errorElement`
- 子 route 的 loader/组件报错会冒泡到最近的有 `errorElement` 的父 route
- 可区分 404、500、网络错误等，渲染不同 UI

### 14.2 使用 useRouteError

- 在 errorElement 组件中 `const error = useRouteError()` 获取错误信息
- 根据 `isRouteErrorResponse` 判断是否为 Response，进而获取 status、data 等

---

## 十五、历史记录与滚动行为

### 15.1 滚动恢复

- `createBrowserRouter` 默认会尝试恢复滚动位置
- 可通过 `createBrowserRouter(routes, { future: { v7_startTransition: true } })` 等选项微调

### 15.2 自定义滚动控制

- 在布局或页面组件内，使用 `useEffect` + `useLocation()` 监听路由变化，手动 `window.scrollTo(0, 0)` 或滚动到指定区域
- 或在 loader 中无法直接控制 DOM，需在组件的 useEffect 中处理

---

## 十六、路由事件监听

### 16.1 使用场景

- 埋点：路由切换时上报 pageview
- 动态修改 document.title：根据 `handle.title` 或 loader 数据
- 关闭全局弹窗、重置某些全局状态

### 16.2 实现方式

- 在根布局或专门组件中，`useEffect` 监听 `useLocation()`
- 监听 `location.pathname`、`location.search` 变化，执行相应逻辑
- 可封装 `useRouteChange(callback)` 统一处理

---

## 十七、多标签页支持（可选）

### 17.1 功能描述

- 类似浏览器多标签，可在多个页面间切换而不关闭
- 需维护「已打开标签列表」和「当前激活标签」
- 点击菜单时决定是「激活已有标签」还是「新开标签」

### 17.2 实现要点

- 使用 Context + Zustand 维护标签列表
- 路由层面可保持单一路由，仅通过「虚拟 tab」切换显示内容
- 与 `handle.keepAlive` 结合，缓存已打开页面的状态
- 复杂度较高，建议作为后续迭代功能

---

## 十八、环境区分

### 18.1 开发环境特有路由

- 如 `/debug`、`/dev-tools` 等
- 根据 `import.meta.env.DEV` 条件注入路由配置
- 生产构建时这些 route 会被 tree-shaking 掉（若使用动态 import）

### 18.2 实现示例

```ts
const devRoutes = import.meta.env.DEV
  ? [{ path: '/debug', element: <Debug /> }]
  : [];
```

---

## 十九、外部链接处理

### 19.1 区分 SPA 内部跳转与外部跳转

- **内部**：使用 `<Link>` 或 `navigate()`，走 React Router
- **外部**：使用 `<a href="https://..." target="_blank">` 或 `window.open`
- 可封装 `<SmartLink href="" />`：若 href 为同源或 path 以 `/` 开头则用 `<Link>`，否则用 `<a>`

### 19.2 确保导航行为正确

- 避免对跨域链接使用 `<Link>`，会导致 SPA 尝试匹配路由
- 外部链接统一加 `rel="noopener noreferrer"` 提升安全性

---

## 二十、实施优先级建议

| 优先级 | 模块                          | 说明                    |
| ------ | ----------------------------- | ----------------------- |
| P0     | 路由结构、嵌套、404、错误捕获 | 基础骨架                |
| P0     | 权限守卫、公共/受保护路由     | 安全与访问控制          |
| P1     | 代码分割、懒加载、Suspense    | 性能                    |
| P1     | 路由元信息、菜单生成、面包屑  | 与现有 AdminLayout 集成 |
| P2     | 数据预加载（loader）          | 按页面按需接入          |
| P2     | 导航守卫、离开确认            | 表单体验                |
| P3     | 路由动画、滚动行为            | 体验增强                |
| P3     | 路由事件、标题同步            | 埋点与 SEO              |
| P4     | 多标签页、环境区分、外部链接  | 进阶能力                |

---

## 附录：推荐的目录与文件结构

```
src/
  router/
    index.tsx              # createBrowserRouter 入口
    routes/
      index.ts             # 汇总路由配置
      public.ts
      admin.ts
    guards/
      authLoader.ts
      permissionLoader.ts
  components/
    RouteFallback.tsx      # Suspense fallback
    RouteErrorBoundary.tsx # errorElement 模板
    Breadcrumb/
    ...
```

---

_文档版本：v1.0 | 更新日期：2025-03_
