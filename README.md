# Zero Web

`apps/web` 是 Zero 项目的前端应用，基于 `Next.js 16`、`React 19`、`TypeScript` 与 `Tailwind CSS 4`，负责登录、首页、今日打卡、觉察记录、复盘、每周投票、每周讨论和后台管理页面。

## 项目定位

这个前端当前承担三类职责：

- 用户侧主链路：登录 / 注册、今日打卡、觉察记录、复盘提醒、首页聚合。
- 周期性功能：每周投票、每周讨论、历史回看。
- 管理侧页面：管理员登录、主题排期、讨论配置、后台概览。

前端默认运行在 `http://localhost:3000`，通过环境变量里的 `NEXT_PUBLIC_API_BASE_URL` 调用后端接口。

---

## 技术栈

- 框架：`Next.js 16`（App Router）
- 视图层：`React 19`
- 语言：`TypeScript`
- 样式：`Tailwind CSS 4` + 项目级全局设计变量
- 代码质量：`ESLint`
- 轻量验证：`node --test` source-level 测试 + `next build`

---

## 架构总览

当前前端主链路可以概括为：

`App Router 页面` → `共享壳层 / 页面模块` → `Server Actions / lib/api` → `Zero API`

### 1. 页面入口层

- 目录：`src/app`
- 作用：承载所有页面路由，是当前应用的主入口。
- 说明：
  - 使用 App Router 目录式路由。
  - 绝大多数页面以服务端组件为主，在服务端直接读取接口数据并渲染。

### 2. 共享壳层与导航层

- 文件：`src/components/app-shell.tsx`
- 作用：统一品牌区、顶部导航、底部导航、账号区和页面外层布局。
- 说明：
  - 页面默认放在 `AppShell` 里。
  - 通用导航项定义在 `src/lib/navigation.ts`。
  - Hero 容器和基础页头由共享组件统一管理。

### 3. 页面模块层

- 目录：`src/app/**`
- 作用：把每个页面内部再拆成较小的模块文件，比如：
  - 页面布局模块
  - 文案模块
  - 表单外观模块
  - 卡片模块
  - 页面 source-level 测试
- 说明：
  - 当前项目不是大而全组件库路线，而是“页面内小模块 + 少量全局共享组件”的方式。
  - 这样更适合个人项目快速演进，也方便你按页面维护视觉和文案。

### 4. 共享组件层

- 目录：`src/components`
- 作用：承载跨页面复用的基础 UI 组件。
- 当前核心组件包括：
  - `app-shell.tsx`
  - `page-hero.tsx`
  - `primary-button.tsx`
  - `section-card.tsx`
  - `status-card.tsx`
  - `metric-card.tsx`
  - `form-field.tsx`
  - `top-nav.tsx`
  - `bottom-tab-nav.tsx`

### 5. 数据与环境层

- 目录：`src/lib`
- 作用：封装接口请求、环境变量、鉴权守卫、导航状态和格式化逻辑。
- 当前关键文件：
  - `src/lib/api.ts`：统一后端请求入口和前端使用的数据类型
  - `src/lib/env.ts`：读取 `NEXT_PUBLIC_API_BASE_URL`
  - `src/lib/auth.ts`：用户态登录守卫
  - `src/lib/admin-auth.ts`：后台管理员守卫
  - `src/lib/navigation.ts`：导航配置

### 6. Server Actions 层

- 目录：`src/app/**/actions.ts`
- 作用：处理登录、保存、提交、后台管理等写操作。
- 说明：
  - 写操作主要走 Server Actions，而不是单独再抽一套前端请求层。
  - Actions 完成后通过 `redirect` 和 `revalidatePath` 驱动页面刷新和状态回流。

---

## 目录说明

### 根目录关键文件

- `README.md`：当前说明文档
- `package.json`：脚本和依赖入口
- `.env.development`：本地开发环境接口配置
- `.env.production`：生产环境接口配置
- `.env.example`：配置模板说明
- `next.config.ts`：Next.js 配置
- `eslint.config.mjs`：ESLint 配置
- `postcss.config.mjs`：PostCSS / Tailwind 配置

### 关键目录

- `public`：静态资源
- `scripts`：本地脚本，目前包含 UTF-8 检查脚本
- `src/app`：页面与页面模块
- `src/components`：共享组件
- `src/lib`：接口、环境、鉴权、导航等共享逻辑

---

## 页面与功能说明

### 1. 首页 `/`

首页不是静态欢迎页，而是一个聚合页。

当前主要负责展示：

- 今日任务摘要
- 连续节奏 / 待复盘数量等状态卡
- 最近需要继续推进的主入口
- 首页情绪氛围 Hero 与视觉引导

相关文件重点：

- `src/app/page.tsx`
- `src/app/home-layout.mjs`
- `src/app/home-weekly.mjs`
- `src/app/home-focus.test.mjs`

### 2. 登录 `/login`

当前支持：

- 普通用户登录
- 普通用户注册
- 登录态写入 Cookie
- 登录失败 / 注册失败提示

相关文件重点：

- `src/app/login/page.tsx`
- `src/app/login/actions.ts`
- `src/app/login/auth-request.mjs`
- `src/lib/auth.ts`

### 3. 今日打卡 `/today`

这是当前主链路页面之一。

当前负责：

- 获取 / 创建今日打卡
- 编辑卡点、改进行动、验证方式
- 提交打卡
- 展示分享面板
- 回看与今日主题关联的觉察记录

相关文件重点：

- `src/app/today/page.tsx`
- `src/app/today/actions.ts`
- `src/app/today/today-form-chrome.mjs`
- `src/app/today/today-share-panel.tsx`
- `src/app/today/history/page.tsx`

### 4. 觉察记录 `/logs`

当前负责：

- 围绕今日主题记录觉察
- 关联今日任务上下文
- 展示日志历史
- 用更偏“觉察”的视觉语言呈现页面氛围

相关文件重点：

- `src/app/logs/page.tsx`
- `src/app/logs/actions.ts`
- `src/app/logs/log-entry-card.mjs`
- `src/app/logs/logs-form-chrome.mjs`

### 5. 复盘 `/reviews`

当前负责：

- 展示待复盘工作区
- 提交复盘结果
- 展示恢复复盘入口
- 跳转复盘历史
- 用更偏“回看 / 沉淀”的 Hero 呈现页面气质

相关文件重点：

- `src/app/reviews/page.tsx`
- `src/app/reviews/actions.ts`
- `src/app/reviews/review-surface.mjs`
- `src/app/reviews/history/page.tsx`

### 6. 每周投票 `/vote`

当前负责：

- 展示当前投票周期
- 展示候选主题
- 提交投票
- 展示个人当日投票状态

相关文件重点：

- `src/app/vote/page.tsx`
- `src/app/vote/actions.ts`
- `src/app/vote/vote-dialogs.tsx`

### 7. 每周讨论 `/discussion`

当前负责：

- 展示当前讨论主题
- 展示讨论时间、入口和分享信息
- 提供讨论分享卡片相关能力

相关文件重点：

- `src/app/discussion/page.tsx`
- `src/app/discussion/discussion-share.mjs`
- `src/app/discussion/share-card/route.ts`

### 8. 管理后台 `/admin/*`

当前已包含：

- `/admin/login`：管理员登录
- `/admin`：后台首页 / 概览
- `/admin/topics`：主题排期管理
- `/admin/discussions`：讨论配置管理

相关文件重点：

- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/topics/page.tsx`
- `src/app/admin/topics/actions.ts`
- `src/app/admin/discussions/page.tsx`
- `src/app/admin/discussions/actions.ts`
- `src/lib/admin-auth.ts`

---

## 共享层说明

### 1. 共享接口失败态文案

文件：`src/app/api-copy.mjs`

用途：

- 统一页面里的“接口暂时不可用”标题、说明和地址提示
- 避免页面各自硬编码 API 提示文案

当前已有对应防回退测试：

- `src/app/api-copy-usage.test.mjs`
- `src/app/no-localhost-page-copy.test.mjs`

### 2. 共享动作错误文案

文件：`src/app/action-copy.mjs`

用途：

- 统一登录失败、注册失败、提交失败、保存失败等动作错误提示
- 避免这些文案散落在页面和 actions 里难以维护

对应防回退测试：

- `src/app/action-copy-usage.test.mjs`

### 3. 共享页面文案与工作区文案

当前这类文案主要收口在：

- `src/app/feedback-chrome.mjs`
- `src/app/workbench-copy.mjs`
- 页面内各自的小型 copy 模块

### 4. 共享接口访问层

文件：`src/lib/api.ts`

用途：

- 统一请求后端接口
- 统一前端使用的数据类型
- 统一请求头、Cookie、返回数据转换和部分规范化逻辑

---

## 登录态与请求方式说明

### 用户态

- 用户登录成功后，会在服务端写入：
  - `zero_user_id`
  - `zero_user_account`
- 读取登录态主要依赖 Cookie。
- 页面守卫主要通过 `src/lib/auth.ts` 实现。

### 管理态

- 管理后台页面通过 `src/lib/admin-auth.ts` 做管理员守卫。
- 管理员页面与普通用户页面是分开的页面入口，不共用一套路由语义。

### 接口请求方式

- 读操作：多数页面在服务端组件里直接调用 `src/lib/api.ts`
- 写操作：多数页面通过 `actions.ts` 提交，然后 `redirect + revalidatePath`

---

## 环境变量与运行方式

前端统一通过 `NEXT_PUBLIC_API_BASE_URL` 访问后端接口。

### 环境文件映射

- `npm run dev`：读取 `.env.development`
- `npm run build` / `npm run start`：读取 `.env.production`
- 参考模板：`.env.example`

### 当前环境读取规则

- `src/lib/env.ts` 会强制读取 `NEXT_PUBLIC_API_BASE_URL`
- 源码里不再写死 `localhost` 作为默认接口地址

---

## 本地开发

### 安装依赖

```bash
cd apps/web
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认访问地址：`http://localhost:3000`

### 生产构建与启动

```bash
npm run build
npm run start
```

---

## 可用脚本

- `npm run dev`：启动开发环境
- `npm run build`：构建生产版本
- `npm run start`：启动生产服务
- `npm run lint`：运行 ESLint
- `npm run check:text`：检查文本文件 UTF-8 编码与可疑字符

---

## 测试与检查

当前前端验证方式主要是：

- `node --test`：页面 source-level 测试、共享模块测试
- `npm run build`：验证 Next.js 构建是否通过
- `npm run check:text`：验证文本编码防线

### 当前测试特点

- 这里的很多测试不是 DOM 交互测试，而是对页面源码结构、文案收口、模块边界的轻量守卫测试。
- 这种方式很适合当前项目：成本低、速度快、能及时防止文案和结构回退。

### 注意

- `check:text` 目前可能会被仓库内既有历史问题拦住，出现这种情况要先分辨是不是这次改动引入的，而不要直接扩散修无关文件。

---

## 当前维护重点文件

如果后续继续开发，优先看这些文件：

- `src/app/page.tsx`
- `src/app/today/page.tsx`
- `src/app/logs/page.tsx`
- `src/app/reviews/page.tsx`
- `src/app/vote/page.tsx`
- `src/app/discussion/page.tsx`
- `src/app/admin/page.tsx`
- `src/components/app-shell.tsx`
- `src/lib/api.ts`
- `src/lib/env.ts`
- `src/app/api-copy.mjs`
- `src/app/action-copy.mjs`
- `src/app/globals.css`

---

## 开发注意事项

- 这是个人项目，小而完整优先，不要过度工程化。
- 页面结构和文案优先围绕主链路：登录 / 今日打卡 / 觉察记录 / 复盘提醒。
- 新增接口提示文案时，优先考虑是否应该放进 `api-copy.mjs`。
- 新增提交失败、登录失败、保存失败文案时，优先考虑是否应该放进 `action-copy.mjs`。
- 改接口地址时，不要在页面里写死地址，统一改环境变量。
- 改页面时，优先保留当前“页面小模块 + 少量共享组件”的组织方式，不要随手抽大而空的抽象层。
- 如果终端输出出现乱码，不要直接相信输出结果；先确认读取方式和文件编码再继续判断。