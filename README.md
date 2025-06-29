# ImageUnblur.site 🔍✨

一个基于 AI 的智能图像去模糊服务，让模糊的照片重获清晰。

## 🌟 功能特性

### 核心功能
- **🖼️ 智能去模糊**: 使用 MagicAPI Deblurer AI 技术自动增强模糊图片
- **📁 多种上传方式**: 支持拖拽上传、文件选择、URL 输入
- **⚡ 实时进度**: 实时显示处理进度和状态
- **🔍 对比预览**: 原图与增强后图片的直观对比
- **💾 本地缓存**: 自动缓存处理结果，解决 API URL 过期问题
- **🚀 无需登录预览**: 访客可以查看处理状态，仅提交时需要登录

### 用户体验
- **📱 响应式设计**: 完美适配移动端和桌面端
- **⚡ 快速处理**: 通常 30-60 秒完成图片增强
- **💳 积分制**: 灵活的积分消费模式
- **🔒 安全可靠**: 基于 Clerk 的企业级身份认证

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 现代化 CSS 框架
- **shadcn/ui** - 高质量 React 组件库
- **React Hook Form** - 表单状态管理
- **tRPC** - 端到端类型安全的 API

### 后端技术栈
- **tRPC** - 类型安全的 API 路由
- **Drizzle ORM** - 现代化的 TypeScript ORM
- **PostgreSQL** - 可靠的关系型数据库
- **Neon** - 无服务器 PostgreSQL 平台

### 第三方服务
- **MagicAPI Deblurer** - AI 图像去模糊服务
- **Clerk** - 身份认证和用户管理
- **Stripe** - 支付和订阅管理
- **Cloudflare R2** - 对象存储（可选）

## 📋 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── image-deblur/            # 图像去模糊页面
│   ├── sign-in/                 # 登录页面
│   └── sign-up/                 # 注册页面
├── components/                   # React 组件
│   ├── ui/                      # shadcn/ui 基础组件
│   ├── image-deblur.tsx         # 主业务组件
│   ├── image-upload-form.tsx    # 上传表单组件
│   ├── image-comparison-preview.tsx # 图片对比组件
│   ├── navbar.tsx               # 导航栏
│   └── hero.tsx                 # 首页英雄区
├── server/                      # 服务端代码
│   ├── api/                     # tRPC API 路由
│   │   └── routers/
│   │       └── imageDeblur.ts   # 图像去模糊 API
│   └── db/                      # 数据库配置
├── lib/                         # 工具函数
│   ├── image-cache.ts           # 图片缓存工具
│   ├── credit.ts                # 积分系统
│   └── utils.ts                 # 通用工具
└── middleware.ts                # Next.js 中间件
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm
- PostgreSQL 数据库

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd image-unblur
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **环境配置**
   ```bash
   cp .env.example .env
   ```

   配置必要的环境变量：
   ```env
   # 数据库
   DATABASE_URL="postgresql://..."

   # Clerk 认证
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."

   # MagicAPI
   MAGICAPI_KEY="your-magic-api-key"

   # Stripe (可选)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **数据库设置**
   ```bash
   pnpm db:push
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

   访问 http://localhost:3000

## 🔧 核心业务逻辑

### 图像处理流程

1. **用户上传图片** → 支持文件上传或 URL 输入
2. **身份验证** → 仅提交处理时需要登录
3. **积分检查** → 确保用户有足够积分（每次1积分）
4. **调用 MagicAPI** → 提交图片到 AI 服务
5. **状态轮询** → 每3秒检查处理进度
6. **自动缓存** → 下载结果并缓存到浏览器本地
7. **结果展示** → 显示原图与增强后的对比

### 缓存机制
```typescript
// 解决 MagicAPI 返回 URL 10分钟过期问题
export async function downloadAndCacheImage(imageUrl: string, cacheKey: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  // 缓存24小时
  imageCache.set(cacheKey, {
    blobUrl,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });

  return blobUrl;
}
```

### 权限控制
```typescript
// middleware.ts - 仅保护特定路由
const isProtectedRoute = createRouteMatcher(["/examples"]);

// /image-deblur 页面访客可访问
// API submitDeblur 需要登录，getDeblurStatus 公开
```

## 📊 API 端点

### tRPC 路由

```typescript
imageDeblur: {
  // 🔒 提交图片处理 (需要登录)
  submitDeblur: protectedProcedure
    .input(z.object({ image_url: z.string().url() }))
    .mutation(),

  // 🔓 查询处理状态 (公开)
  getDeblurStatus: publicProcedure
    .input(z.object({
      requestId: z.string(),
      imageId: z.string().optional()
    }))
    .query(),

  // 🔒 获取历史记录 (需要登录)
  getDeblurHistory: protectedProcedure
    .input(z.object({ limit: z.number(), offset: z.number() }))
    .query()
}
```

## 🛠️ 开发指南

### 添加新功能
1. 在 `src/server/api/routers/` 添加新的 tRPC 路由
2. 在 `src/components/` 创建对应的 React 组件
3. 更新 `src/app/` 中的页面路由

### 数据库修改
```bash
# 修改 schema
vim src/server/db/schema.ts

# 推送更改
pnpm db:push

# 生成迁移文件 (生产环境)
pnpm db:generate
```

### 组件开发
所有 UI 组件基于 shadcn/ui，遵循以下原则：
- 使用 TypeScript 确保类型安全
- 遵循 Tailwind CSS 设计系统
- 实现响应式设计
- 添加适当的错误处理

## 🚀 部署

### Netlify 部署 (推荐)
```bash
# 构建项目
pnpm build

# 部署到 Netlify
# 项目已配置 netlify.toml
```

### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 环境变量配置
确保在部署平台配置所有必要的环境变量，特别是：
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `MAGICAPI_KEY`
- `NEXT_PUBLIC_*` 变量

## 📈 监控和分析

### 性能指标
- 图片处理成功率
- 平均处理时间
- 缓存命中率
- 用户积分消耗

### 错误追踪
- API 调用失败
- 图片上传错误
- 缓存失败情况
- 用户认证问题

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🆘 支持

如遇问题，请：
1. 查看 [技术文档](./docs/image-deblur-architecture.md)
2. 检查 [常见问题](#)
3. 提交 [Issue](../../issues)

---

**ImageUnblur.site** - 让每一张模糊的照片都重获新生 ✨
