# 路径别名配置说明

本文档说明本项目路径别名（Path Alias）的配置及使用方式。

## 配置概览

| 工具       | 配置文件            | 作用            |
| ---------- | ------------------- | --------------- |
| TypeScript | `tsconfig.app.json` | 类型校验时解析  |
| Vite       | `vite.config.ts`    | 开发/构建时解析 |
| ESLint     | `eslint.config.js`  | 静态检查时解析  |

---

## 已配置别名

| 别名  | 映射路径  | 说明            |
| ----- | --------- | --------------- |
| `@/*` | `./src/*` | 指向 `src` 目录 |

---

## 配置详解

### 1. TypeScript（tsconfig.app.json）

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- **baseUrl**：解析相对路径的根目录
- **paths**：路径映射，`@/*` 对应 `./src/*`，`*` 为通配符

使 `tsc` 在类型检查时能正确解析 `@/` 开头的导入。

### 2. Vite（vite.config.ts）

```typescript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

- 使用 `path.resolve` 得到 `src` 的绝对路径
- ESM 模式下需通过 `fileURLToPath(import.meta.url)` 获取 `__dirname`

使开发服务器和构建阶段能正确解析别名导入。

### 3. ESLint（eslint.config.js）

```javascript
languageOptions: {
  parser: tseslint.parser,
  parserOptions: {
    project: ['./tsconfig.app.json', './tsconfig.node.json'],
    tsconfigRootDir: import.meta.dirname,
  },
},
```

- **project**：指定 TypeScript 项目配置，以复用 `paths` 等设置
- **tsconfigRootDir**：tsconfig 所在目录

使 ESLint 的类型感知规则能识别路径别名，避免误报。

---

## 使用示例

### 导入组件

```typescript
// 相对路径（不推荐深层嵌套时使用）
import { Button } from '../../../components/Button';

// 路径别名（推荐）
import { Button } from '@/components/Button';
```

### 导入工具函数

```typescript
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';
```

### 导入样式

```typescript
import '@/App.css';
import '@/styles/global.css';
```

### 导入资源

```typescript
import logo from '@/assets/logo.svg';
```

---

## 扩展别名

如需新增别名（如 `@components`、`@utils`），需在以下三处同步修改：

1. **tsconfig.app.json**

```json
"paths": {
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@utils/*": ["./src/utils/*"]
}
```

2. **vite.config.ts**

```typescript
alias: {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@utils': path.resolve(__dirname, 'src/utils'),
},
```

3. **ESLint** 使用 `tsconfig.app.json` 的 `paths`，无需额外配置。

---

## 验证

```bash
# 类型检查 + 构建
pnpm run build

# 静态检查
pnpm run lint
```

两项均通过即表示路径别名配置正确。
