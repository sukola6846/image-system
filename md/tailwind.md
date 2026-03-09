# Tailwind CSS 使用指南

本项目使用 **Tailwind CSS v4**，搭配 Vite 构建。

## 安装与配置

### 依赖

```json
{
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

### Vite 配置

在 `vite.config.ts` 中注册插件：

```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### CSS 入口

在 `src/index.css` 中引入 Tailwind：

```css
@import 'tailwindcss';
```

## v4 与 v3 的区别

### 无需 tailwind.config.js

Tailwind v4 默认不需要单独的配置文件。如需自定义主题，在 CSS 中使用 `@theme`：

```css
@import 'tailwindcss';

@theme {
  /* 自定义颜色 */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  /* 自定义字体 */
  --font-sans: 'Inter', sans-serif;

  /* 自定义断点 */
  --breakpoint-md: 768px;
}
```

### 单行引入替代三指令

| v3                      | v4                       |
| ----------------------- | ------------------------ |
| `@tailwind base;`       | `@import 'tailwindcss';` |
| `@tailwind components;` | （已包含）               |
| `@tailwind utilities;`  | （已包含）               |

`@import 'tailwindcss'` 自动包含：

- **Preflight**（样式重置）
- **Components**（组件层）
- **Utilities**（工具类）

## 主题变量工具类

项目已将主题色与背景风格同步到 Tailwind，以下工具类会随用户切换主题自动生效：

| 工具类             | 用途                           |
| ------------------ | ------------------------------ |
| `bg-theme`         | 主题色背景（按钮、卡片强调等） |
| `text-theme`       | 主题色文字（链接、图标等）     |
| `border-theme`     | 主题色边框                     |
| `bg-base`          | 页面/容器背景                  |
| `text-primary`     | 主要文字色（标题、正文）       |
| `text-secondary`   | 次要文字色（说明、辅助）       |
| `text-disabled`    | 禁用态文字色                   |
| `text-placeholder` | 占位符文字色                   |

### 主题变量使用示例

```tsx
{
  /* 页面容器：使用背景色 + 主要文字色 */
}
<div className="min-h-screen bg-base text-primary">
  <h1 className="text-2xl font-bold text-primary">页面标题</h1>
  <p className="text-secondary">辅助说明文字</p>

  {/* 主题色强调：按钮、链接 */}
  <button className="px-4 py-2 bg-theme text-white rounded-lg hover:opacity-90">主要按钮</button>
  <a href="#" className="text-theme hover:underline">
    链接
  </a>

  {/* 输入框占位符 */}
  <input className="border border-gray-300 text-primary placeholder:text-placeholder" placeholder="请输入" />

  {/* 禁用态 */}
  <button disabled className="text-disabled cursor-not-allowed">
    禁用按钮
  </button>
</div>;
```

## 使用示例

### 基础用法

```tsx
<div className="flex items-center justify-center min-h-screen bg-base text-primary">
  <h1 className="text-3xl font-bold text-theme">Hello Tailwind</h1>
</div>
```

### 响应式与状态

```tsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 rounded-lg md:px-6 lg:text-lg">按钮</button>
```

### 与 classnames 配合

```tsx
import cn from 'classnames';

<div className={cn('base-class', isActive && 'active', className)} />;
```

## 常用工具类速查

| 类型 | 示例                                                                |
| ---- | ------------------------------------------------------------------- |
| 布局 | `flex`, `grid`, `items-center`, `justify-between`                   |
| 间距 | `p-4`, `m-2`, `gap-4`, `space-x-2`                                  |
| 尺寸 | `w-full`, `h-screen`, `min-h-screen`                                |
| 文字 | `text-sm`, `font-bold`, `text-center`                               |
| 颜色 | `bg-theme`, `text-primary`, `bg-base`, `text-secondary`（主题变量） |
| 圆角 | `rounded`, `rounded-lg`, `rounded-full`                             |
| 阴影 | `shadow`, `shadow-lg`, `shadow-md`                                  |

## 参考链接

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS v4 升级指南](https://tailwindcss.com/docs/upgrade-guide)
