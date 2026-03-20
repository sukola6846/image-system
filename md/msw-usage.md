# MSW 使用说明（本项目）

## 1. MSW 是什么

MSW（Mock Service Worker）是一个“模拟服务工作线程”。它会在**浏览器网络层**拦截请求，并返回你在 `handlers` 里定义的响应。

相比“只在代码里判断 mock”，MSW 的优势是：

- 业务代码仍然按真实方式发请求（axios/fetch 不需要改）
- 切换到真实后端时，mock 逻辑可逐步移除
- 所有请求都经过同一套拦截/响应规则，便于调试

本项目当前处于 **Phase A**：用 MSW 把接口跑通（登录 / 当前用户 / 图片列表）。

## 2. 本项目的接入方式

### 2.1 启动 worker

在 `src/main.tsx` 中，开发环境（`import.meta.env.DEV`）会启动 MSW worker：

- `src/mocks/browser.ts`：`setupWorker(...handlers)`
- `src/main.tsx`：`worker.start({ onUnhandledRequest: 'bypass' })` 后再渲染应用

因此你只要运行 `pnpm dev`，`/api/*` 请求就会被 mock。

### 2.2 handlers 组织

当前 handlers 放在：

- `src/mocks/handlers/auth.ts`：`POST /api/auth/login`
- `src/mocks/handlers/user.ts`：`GET /api/user/me`
- `src/mocks/handlers/images.ts`：`GET /api/images`

统一汇总：

- `src/mocks/index.ts`：`export const handlers = [...authHandlers, ...userHandlers, ...imagesHandlers]`

### 2.3 mock 数据与约定

本项目约定后端响应为 `{ code, data, message }`：

- HTTP 200
  - `code === 0`：成功，返回 `data`
  - `code !== 0`：业务错误，走错误分支
- HTTP 5xx：直接走错误分支（不依赖业务 `code`）

并且登录 token 从响应头获取：

- 登录成功：响应头 `Authorization: Bearer <token>`
- 请求层会把该 token 写入 `authStore`

## 3. 本项目示例接口（当前实现）

### 3.1 登录

- 请求：`POST /api/auth/login`
- 请求体：`{ username, password }`
- 成功条件：`admin / 123456`
- 登录成功返回：
  - HTTP 200，`code: 0`
  - 响应头：`Authorization: Bearer mock-jwt-admin`
  - 响应体：`{ code: 0, data: { user }, message: 'ok' }`

### 3.2 获取当前用户

- 请求：`GET /api/user/me`
- 依赖：必须携带 `Authorization: Bearer ...`
- 未携带 token：HTTP 401，`{ code: 40101, message: '未登录' }`

### 3.3 图片列表

- 请求：`GET /api/images`
- 依赖：必须携带 `Authorization: Bearer ...`
- 支持查询参数：
  - `page`
  - `pageSize`

## 4. 如何调试/验证 mock 是否生效

1. 启动项目：`pnpm dev`
2. 在浏览器打开页面，执行登录/进入图片列表
3. 打开 DevTools Network
4. 观察请求是否命中 `/api/*`，并能在 Response 中看到 mock 返回的结构

如果发现请求没有被拦截，一般需要检查：

- `public/mockServiceWorker.js` 是否存在
- `src/main.tsx` 是否进入 `import.meta.env.DEV` 分支

## 5. 初始化 worker（首次或丢失时）

如果 `public/mockServiceWorker.js` 不存在，执行：

```bash
pnpm exec msw init public --save
```

之后重新启动 `pnpm dev`。

## 6. 何时移除 MSW

当你的真实后端 API 就绪后，可以：

- 逐步删除 handlers（或仅保留少量 fallback）
- 在 `main.tsx` 中切换/禁用 worker 启动
- 保持业务接口层 `apis/*` 不变，降低迁移成本
