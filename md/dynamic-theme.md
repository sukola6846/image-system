# 动态主题实现说明

本文档详细说明项目中动态主题的设计思路、关键技术及使用方式。

---

## 一、设计思路

### 1.1 双维度主题系统

项目采用**主题色（Accent Color）+ 背景风格（Background Style）**的双维度设计：

| 维度         | 用途                                   | 预设数量                       |
| ------------ | -------------------------------------- | ------------------------------ |
| **主题色**   | 按钮、链接、悬停、选中等强调性元素     | 8 种（淡绿、淡蓝、淡紫等）     |
| **背景风格** | 页面背景、文字色、禁用态等整体明暗基调 | 4 种（纯白、暖白、深灰、柔黑） |

两者相互独立又协同工作：用户可自由组合（如「淡蓝 + 深灰」），实现 8 × 4 = 32 种视觉组合。

### 1.2 数据流架构

```
用户选择 (ThemeSwitcher)
        ↓
   themeStore (Zustand + 持久化)
        ↓
   ┌────┴────┐
   ↓         ↓
useThemeSync   useAntdTheme
   ↓         ↓
:root CSS变量   ConfigProvider
   ↓         ↓
SCSS/Tailwind   Ant Design 组件
```

- **单一数据源**：`themeStore` 存储 `themeColorId` 和 `backgroundStyleId`
- **双通道生效**：通过 `useThemeSync` 写入 CSS 变量，通过 `useAntdTheme` 注入 Ant Design
- **持久化**：使用 Zustand `persist` 将选择保存到 localStorage（key: `theme-storage`）

### 1.3 设计原则

- **极简偏淡**：主题色和背景均采用柔和色调，避免刺眼
- **统一管理**：常量集中定义，避免散落重复
- **类型安全**：TypeScript 联合类型确保 id 引用正确
- **无侵入使用**：通过 CSS 变量，任意样式文件均可引用，无需显式导入

---

## 二、关键技术

### 2.1 CSS 变量体系

在 `:root` 上定义 6 个 CSS 变量，由 `useThemeSync` 动态覆盖：

| 变量名               | 含义         | 使用场景                       |
| -------------------- | ------------ | ------------------------------ |
| `--theme-color`      | 主题色       | 按钮、链接、选中边框、强调元素 |
| `--bg-base`          | 基础背景色   | 页面背景、容器背景             |
| `--text-primary`     | 主要文字色   | 标题、正文                     |
| `--text-secondary`   | 次要文字色   | 说明、辅助信息                 |
| `--text-disabled`    | 禁用态文字色 | 禁用状态                       |
| `--text-placeholder` | 占位符文字色 | 输入框占位符                   |

### 2.2 Tailwind 映射

在 `index.css` 中通过 `@theme` 将 CSS 变量映射为 Tailwind 工具类：

```css
@theme {
  --color-theme: var(--theme-color);
  --color-base: var(--bg-base);
  --color-primary: var(--text-primary);
  --color-secondary: var(--text-secondary);
  --color-disabled: var(--text-disabled);
  --color-placeholder: var(--text-placeholder);
}
```

使用示例：`text-secondary`、`bg-base`、`text-theme` 等会随主题切换自动生效。

### 2.3 Ant Design 联动

`useAntdTheme` 根据 `themeStore` 生成 `ThemeConfig`：

- **token**：`colorPrimary`、`colorBgContainer`、`colorText` 等与背景风格绑定
- **algorithm**：背景为 `dark` 时使用 `darkAlgorithm`，否则使用 `defaultAlgorithm`
- **ConfigProvider**：在 App 根节点包裹，使所有 Ant Design 组件跟随主题

### 2.4 持久化

使用 Zustand 的 `persist` 中间件，存储 key 为 `theme-storage`。用户刷新页面后主题选择保持不变。

---

## 三、如何使用

### 3.1 在 React 组件中使用主题 Store

```tsx
import { useThemeStore } from '@/stores';

function MyComponent() {
  const { themeColorId, backgroundStyleId, setThemeColorId, setBackgroundStyleId } = useThemeStore();
  // 读取或更新主题
}
```

### 3.2 在 SCSS/CSS 中使用 CSS 变量

```scss
.myButton {
  background-color: var(--theme-color);
  color: var(--text-primary);
}

.myCard {
  background-color: var(--bg-base);
  border-color: var(--text-secondary);
}
```

### 3.3 在 Tailwind 中使用主题工具类

```tsx
<p className="text-secondary">说明文字</p>
<div className="bg-base text-primary">...</div>
```

### 3.4 获取主题色或背景风格的原始值

```ts
import { getThemeColorValue } from '@/constants/theme/themeColors';
import { getBackgroundStyle } from '@/constants/theme/backgroundStyles';

const color = getThemeColorValue('lightBlue');
const style = getBackgroundStyle('darkGray');
```

### 3.5 添加新主题色或背景风格

- **新主题色**：在 `THEME_COLORS` 数组中追加项，`ThemeColorId` 类型会自动推导
- **新背景风格**：在 `BACKGROUND_STYLES` 数组中追加项，需包含 `id`、`name`、`type`、`bg`、`textPrimary` 等字段

---

## 四、初始化与挂载

在应用根组件（如 `App.tsx`）中：

1. 调用 `useThemeSync()`：将 store 状态同步到 `:root` CSS 变量
2. 调用 `useAntdTheme()`：生成 Ant Design theme 配置
3. 用 `ConfigProvider theme={antdTheme}` 包裹子组件

```tsx
function App() {
  useThemeSync();
  const antdTheme = useAntdTheme();
  return <ConfigProvider theme={antdTheme}>{/* 子组件 */}</ConfigProvider>;
}
```

---

## 五、相关代码文件路径

以下为与动态主题功能相关的所有代码文件，按模块分类，便于查阅和维护。

### 5.1 常量与类型定义

| 路径                                      | 说明                                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/constants/theme/themeColors.ts`      | 主题色常量（8 种预设）、`ThemeColorItem`、`getThemeColorValue`                                 |
| `src/constants/theme/backgroundStyles.ts` | 背景风格常量（4 种预设）、`BackgroundStylePreset`、`getBackgroundStyle`、`BACKGROUND_CSS_VARS` |
| `src/constants/index.ts`                  | 统一导出上述常量与类型                                                                         |

### 5.2 状态管理

| 路径                       | 说明                                        |
| -------------------------- | ------------------------------------------- |
| `src/stores/themeStore.ts` | Zustand store：主题色与背景风格状态及持久化 |
| `src/stores/index.ts`      | 导出 `useThemeStore`                        |

### 5.3 Hooks

| 路径                        | 说明                                     |
| --------------------------- | ---------------------------------------- |
| `src/hooks/useThemeSync.ts` | 将 store 状态同步到 `:root` CSS 变量     |
| `src/hooks/useAntdTheme.ts` | 根据 store 生成 Ant Design `ThemeConfig` |

### 5.4 UI 组件

| 路径                                             | 说明                                                     |
| ------------------------------------------------ | -------------------------------------------------------- |
| `src/components/ThemeSwitcher/index.tsx`         | 主题切换器组件（主题色 / 背景风格选择 UI）               |
| `src/components/ThemeSwitcher/index.module.scss` | 主题切换器样式（引用 `--theme-color`、`--text-primary`） |

### 5.5 应用入口与布局

| 路径            | 说明                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| `src/App.tsx`   | 调用 `useThemeSync`、`useAntdTheme`，挂载 `ConfigProvider` 与 `ThemeSwitcher` |
| `src/index.css` | `:root` 默认变量、Tailwind `@theme` 映射                                      |

### 5.6 使用主题的页面与样式

| 路径                               | 说明                                        |
| ---------------------------------- | ------------------------------------------- |
| `src/app1.module.scss`             | 根布局样式（`--bg-base`、`--text-primary`） |
| `src/pages/home/index.module.scss` | 首页样式（`--bg-base`）                     |

### 5.7 完整路径列表（复制用）

```
src/constants/theme/themeColors.ts
src/constants/theme/backgroundStyles.ts
src/constants/index.ts
src/stores/themeStore.ts
src/stores/index.ts
src/hooks/useThemeSync.ts
src/hooks/useAntdTheme.ts
src/components/ThemeSwitcher/index.tsx
src/components/ThemeSwitcher/index.module.scss
src/App.tsx
src/index.css
src/app1.module.scss
src/pages/home/index.module.scss
```
