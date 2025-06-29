# Image Deblur 功能技术文档

## 📋 业务概述

ImageUnblur.site 是一个基于 AI 的图像去模糊服务，用户可以上传模糊的图片，通过 MagicAPI Deblurer 获得清晰的增强版本。

### 核心功能
- ✅ 支持文件上传和 URL 输入两种方式
- ✅ 实时处理进度展示
- ✅ 前后对比预览
- ✅ 本地缓存机制（解决 API 返回 URL 10分钟有效期问题）
- ✅ 无需登录即可查看处理状态
- ✅ 积分制收费模式

---

## 🏗️ 技术架构

### 整体流程图
```
用户上传图片 → 验证登录状态 → 扣除积分 → 调用 MagicAPI → 轮询状态 → 本地缓存 → 展示结果
```

### 技术栈
- **前端**: Next.js 15, TypeScript, React Hook Form, Tailwind CSS
- **后端**: tRPC, Drizzle ORM, PostgreSQL (Neon)
- **认证**: Clerk
- **AI服务**: MagicAPI Deblurer
- **存储**: 本地浏览器缓存 (Blob URLs)

---

## 📁 核心文件结构

```
src/
├── components/
│   ├── image-deblur.tsx              # 主组件，业务逻辑控制
│   ├── image-upload-form.tsx         # 文件上传表单
│   └── image-comparison-preview.tsx  # 图片对比预览
├── server/api/routers/
│   └── imageDeblur.ts               # 后端 API 路由
├── lib/
│   └── image-cache.ts               # 图片缓存工具
└── app/
    └── image-deblur/
        └── page.tsx                 # 页面入口
```

---

## 🔄 业务流程详解

### 1. 用户交互流程

#### 1.1 图片上传阶段
```typescript
// image-upload-form.tsx
const handleSubmit = async (data: FormData) => {
  // 支持两种输入方式：
  // 1. 文件上传 → 转换为 blob URL
  // 2. 图片 URL 直接输入

  if (imageFile) {
    const imageUrl = URL.createObjectURL(imageFile);
    await onSubmit(imageUrl);
  } else if (imageUrl) {
    await onSubmit(imageUrl);
  }
};
```

#### 1.2 认证和积分检查
```typescript
// image-deblur.tsx
const handleSubmit = async (imageUrl: string) => {
  if (!isSignedIn) {
    openSignIn(); // 未登录则弹出登录界面
    return false;
  }

  // 提交到后端处理
  submitDeblurMutate({ image_url: imageUrl });
};
```

#### 1.3 后端处理逻辑
```typescript
// imageDeblur.ts - submitDeblur procedure
async ({ ctx, input }) => {
  // 1. 验证用户会话
  if (!ctx.session?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // 2. 检查积分余额
  const user = await ctx.db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const creditCost = 1; // 每次处理消耗1积分
  if (!hasEnoughCredits(user.creditBalance, creditCost)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "积分不足" });
  }

  // 3. 调用 MagicAPI
  const requestId = await submitImageForDeblur(input.image_url);

  // 4. 扣除积分并保存记录
  const newCreditBalance = calculateRemainingCredits(user.creditBalance, creditCost);
  await ctx.db.update(users)
    .set({ creditBalance: newCreditBalance })
    .where(eq(users.id, userId));

  return { requestId, imageId: savedImage[0]?.id };
}
```

### 2. MagicAPI 集成

#### 2.1 提交图片处理
```typescript
async function submitImageForDeblur(imageUrl: string): Promise<string> {
  const response = await fetch('https://api.market/magicapi/deblurer/process', {
    method: 'POST',
    headers: {
      'x-magicapi-key': env.MAGICAPI_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_url: imageUrl })
  });

  const data = await response.json();
  return data.request_id; // 返回请求ID用于状态轮询
}
```

#### 2.2 状态轮询机制
```typescript
// 前端每3秒轮询一次状态
const { data: statusData } = api.imageDeblur.getDeblurStatus.useQuery(
  { requestId: currentResult?.requestId, imageId: currentResult?.imageId },
  {
    enabled: !!currentResult?.requestId && currentResult.status === 'processing',
    refetchInterval: (data) => {
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false; // 停止轮询
      }
      return 3000; // 3秒间隔
    }
  }
);
```

#### 2.3 获取处理结果
```typescript
async function getDeblurResult(requestId: string): Promise<DeblurStatusResponse> {
  const response = await fetch(`https://api.market/magicapi/deblurer/${requestId}`, {
    headers: { 'x-magicapi-key': env.MAGICAPI_KEY }
  });

  return response.json();
}
```

### 3. 本地缓存机制

#### 3.1 缓存策略
由于 MagicAPI 返回的图片 URL 仅有 10 分钟有效期，我们实现了浏览器本地缓存：

```typescript
// image-cache.ts
export async function downloadAndCacheImage(
  imageUrl: string,
  cacheKey: string
): Promise<string> {
  try {
    // 下载远程图片
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob); // 创建本地 blob URL

    // 缓存到内存（24小时有效期）
    const cachedImage: CachedImage = {
      blobUrl,
      originalUrl: imageUrl,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时
    };

    imageCache.set(cacheKey, cachedImage);
    return blobUrl;
  } catch (error) {
    console.error('缓存失败:', error);
    return imageUrl; // 降级到原始 URL
  }
}
```

#### 3.2 自动缓存流程
```typescript
// image-deblur.tsx
onSuccess(data) {
  if (data.status === 'completed' && data.image_url) {
    // 立即开始下载缓存
    setCurrentResult(prev => ({ ...prev, isDownloading: true }));

    // 异步下载和缓存
    const cacheKey = `deblurred-${currentResult?.requestId}`;
    downloadAndCacheImage(data.image_url, cacheKey)
      .then((localUrl) => {
        setCurrentResult(prev => ({
          ...prev,
          local_processed_url: localUrl, // 本地缓存 URL
          isDownloading: false
        }));

        toast.success("图片处理完成并已缓存到本地！");
      });
  }
}
```

---

## 🔐 权限控制逻辑

### 中间件配置
```typescript
// middleware.ts
const isProtectedRoute = createRouteMatcher(["/examples"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// ✅ /image-deblur 页面无需登录即可访问
// ✅ 只有提交处理请求时才需要登录
```

### API 路由权限
```typescript
// imageDeblur.ts
export const imageDeblurRouter = createTRPCRouter({
  submitDeblur: protectedProcedure    // 🔒 需要登录
    .mutation(async ({ ctx, input }) => { /* 提交处理 */ }),

  getDeblurStatus: publicProcedure    // 🔓 公开访问
    .query(async ({ ctx, input }) => { /* 查询状态 */ }),
});
```

---

## 💾 数据库设计

### images 表结构
```sql
CREATE TABLE images (
  id          TEXT PRIMARY KEY,
  userId      TEXT NOT NULL,
  prompt      TEXT,              -- 存储请求描述
  imageUrl    TEXT,              -- 不再存储图片URL（已改为本地缓存）
  requestId   TEXT,              -- MagicAPI 请求ID
  status      TEXT DEFAULT 'processing', -- processing | completed | failed
  createdAt   TIMESTAMP DEFAULT NOW()
);
```

### 积分系统
```typescript
// 每次去模糊消耗 1 积分
const creditCost = 1;

// 积分检查逻辑
if (!hasEnoughCredits(user.creditBalance, creditCost)) {
  throw new TRPCError({
    code: "FORBIDDEN",
    message: "积分不足，请购买更多积分继续使用。",
  });
}
```

---

## 🎨 用户界面组件

### 1. ImageDeblur (主控制组件)
```typescript
// image-deblur.tsx
export default function ImageDeblur() {
  const [currentResult, setCurrentResult] = useState<DeblurResult | null>(null);

  // 状态管理：
  // - processing: 处理中
  // - completed: 完成
  // - failed: 失败
  // - isDownloading: 缓存中

  return (
    <div className="flex max-w-6xl gap-4 md:flex-row">
      <ImageUploadForm onSubmit={handleSubmit} />
      <ImageComparisonPreview
        originalImageUrl={currentResult?.original_url}
        processedImageUrl={currentResult?.local_processed_url || currentResult?.processed_url}
        status={currentResult?.status}
        isDownloading={currentResult?.isDownloading}
      />
    </div>
  );
}
```

### 2. ImageUploadForm (上传表单)
```typescript
// 支持功能：
// ✅ 拖拽上传
// ✅ 点击选择文件
// ✅ URL 输入
// ✅ 文件类型验证 (jpg, png, webp)
// ✅ 文件大小限制
```

### 3. ImageComparisonPreview (对比预览)
```typescript
// 显示功能：
// ✅ 原图预览
// ✅ 处理结果预览
// ✅ 进度条动画
// ✅ 状态指示器
// ✅ 下载按钮
// ✅ 缓存进度提示
```

---

## 🔧 错误处理

### 1. API 错误处理
```typescript
// MagicAPI 错误
if (!response.ok) {
  const errorData = await response.json();
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `处理失败: ${errorData.error}`,
  });
}
```

### 2. 缓存错误处理
```typescript
// 缓存失败降级策略
downloadAndCacheImage(imageUrl, cacheKey)
  .catch((error) => {
    console.error('缓存失败:', error);
    // 继续使用原始 URL，但会在 10 分钟后失效
    toast.success("图片处理完成！", {
      description: "缓存失败，请及时下载图片。"
    });
  });
```

### 3. 积分不足处理
```typescript
if (!hasEnoughCredits(user.creditBalance, creditCost)) {
  throw new TRPCError({
    code: "FORBIDDEN",
    message: "积分不足。请购买更多积分以继续使用。",
  });
}
```

---

## 🚀 性能优化

### 1. 图片缓存优化
- **内存缓存**: 使用 Map 存储 blob URLs
- **自动清理**: 定期清理过期缓存
- **降级策略**: 缓存失败时使用原始 URL

### 2. 轮询优化
- **智能停止**: 完成或失败时自动停止轮询
- **合理间隔**: 3秒间隔避免过频请求
- **条件启用**: 仅在处理中时启用轮询

### 3. UI 响应性
- **加载状态**: 完整的加载状态管理
- **进度模拟**: 处理中显示进度动画
- **即时反馈**: Toast 通知用户操作结果

---

## 📊 监控和日志

### 1. 错误日志
```typescript
catch (error) {
  console.error('Image processing failed:', error);
  // 在生产环境中应该发送到日志服务
}
```

### 2. 用户行为追踪
- 图片上传成功率
- 处理完成率
- 缓存成功率
- 积分消耗统计

---

## 🔮 未来扩展

### 1. 功能扩展
- [ ] 批量处理支持
- [ ] 更多图片格式支持
- [ ] 处理质量选择
- [ ] 历史记录管理

### 2. 技术改进
- [ ] Service Worker 缓存
- [ ] WebAssembly 本地处理
- [ ] CDN 图片分发
- [ ] 实时处理进度
