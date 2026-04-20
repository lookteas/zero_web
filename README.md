# Zero Web

`apps/web` 是 Zero 项目的前端应用，使用 `Next.js 16`、`React 19`、`TypeScript` 与 `Tailwind CSS 4`。

## 主要页面

- `/`：首页概览
- `/login`：登录页
- `/today`：今日任务
- `/logs`：进度日志
- `/reviews`：复盘回顾
- `/vote`：每周投票
- `/discussion`：讨论说明
- `/admin/topics`：后台主题管理

## 本地开发

```bash
cd apps/web
npm install
npm run dev
```

默认访问地址：`http://localhost:3000`

## 可用脚本

- `npm run dev`：启动开发环境
- `npm run build`：构建生产版本
- `npm run start`：启动生产服务
- `npm run lint`：运行 ESLint

## 接口配置

前端统一通过 `NEXT_PUBLIC_API_BASE_URL` 访问后端接口。

Next.js 会按运行命令自动读取对应环境文件：

- `npm run dev`：读取 `apps/web/.env.development`
- `npm run build` / `npm run start`：读取 `apps/web/.env.production`

示例配置见：`apps/web/.env.example`

## 当前状态

- 已完成公共布局与导航
- 已封装首页、今日任务、日志、复盘等接口请求
- 页面可正常构建，`build` 与 `lint` 已通过
- 当前适合继续做真实接口联调与登录态接入
