# Image Deblur API 接口文档

## 📝 概述

本文档描述了 ImageUnblur.site 图像去模糊功能的 API 接口规范，基于 tRPC 构建。

---

## 🔐 认证说明

### 认证方式
- **类型**: Clerk Session-based Authentication
- **Header**: 自动通过 Clerk 中间件处理
- **Session**: 通过 `ctx.session.userId` 获取用户信息

### 权限级别
- **Protected Procedures**: 需要用户登录
- **Public Procedures**: 无需登录，公开访问

---

## 📡 API 端点

### Base URL
```
Local: http://localhost:3000/api/trpc
Production: https://your-domain.com/api/trpc
```

### 路由前缀
```
imageDeblur.*
```

---

## 🚀 API 接口详情

### 1. 提交图片去模糊

#### `imageDeblur.submitDeblur`

**权限**: 🔒 Protected (需要登录)

**方法**: Mutation

**描述**: 提交图片进行去模糊处理，扣除用户积分并调用 MagicAPI

#### 请求参数
```typescript
interface SubmitDeblurInput {
  image_url: string; // 图片 URL，必须是有效的 URL 格式
}
```

#### 请求示例
```typescript
// 前端调用
const result = await api.imageDeblur.submitDeblur.mutate({
  image_url: "https://example.com/blurry-image.jpg"
});
```

#### 响应格式
```typescript
interface SubmitDeblurResponse {
  success: boolean;
  requestId: string;          // MagicAPI 返回的请求 ID
  imageId?: string;           // 数据库记录 ID
  creditsRemaining: number;   // 用户剩余积分
}
```

#### 响应示例
```json
{
  "success": true,
  "requestId": "req_abc123def456",
  "imageId": "img_789xyz",
  "creditsRemaining": 99
}
```

#### 错误响应
```typescript
// 401 - 未登录
{
  "code": "UNAUTHORIZED",
  "message": "User session not found"
}

// 404 - 用户不存在
{
  "code": "NOT_FOUND",
  "message": "User not found"
}

// 403 - 积分不足
{
  "code": "FORBIDDEN",
  "message": "Insufficient credits. Please purchase more credits to continue."
}

// 500 - 处理失败
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Failed to submit image for deblurring: [详细错误信息]"
}
```

---

### 2. 查询处理状态

#### `imageDeblur.getDeblurStatus`

**权限**: 🔓 Public (无需登录)

**方法**: Query

**描述**: 查询图片处理状态和结果，支持轮询

#### 请求参数
```typescript
interface GetDeblurStatusInput {
  requestId: string;        // MagicAPI 请求 ID（必填）
  imageId?: string;         // 数据库记录 ID（可选）
}
```

#### 请求示例
```typescript
// 前端调用
const status = await api.imageDeblur.getDeblurStatus.useQuery({
  requestId: "req_abc123def456",
  imageId: "img_789xyz"
});
```

#### 响应格式
```typescript
interface GetDeblurStatusResponse {
  status: "processing" | "completed" | "failed";
  image_url?: string;           // 处理完成的图片 URL（仅在 completed 时存在）
  original_url?: string;        // 原始图片 URL
  warning?: string;             // 警告信息
  expires_in_minutes?: number;  // URL 过期时间（分钟）
}
```

#### 响应示例

**处理中**
```json
{
  "status": "processing"
}
```

**处理完成**
```json
{
  "status": "completed",
  "image_url": "https://api.market/results/deblurred-abc123.jpg",
  "expires_in_minutes": 10
}
```

**处理失败**
```json
{
  "status": "failed"
}
```

#### 错误响应
```typescript
// 500 - API 调用失败
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Failed to get deblur result: [详细错误信息]"
}
```

---

### 3. 获取用户处理历史

#### `imageDeblur.getDeblurHistory`

**权限**: 🔒 Protected (需要登录)

**方法**: Query

**描述**: 获取用户的图片处理历史记录，支持分页

#### 请求参数
```typescript
interface GetDeblurHistoryInput {
  limit?: number;   // 每页条数，默认 10，最大 50
  offset?: number;  // 偏移量，默认 0
}
```

#### 请求示例
```typescript
// 前端调用
const history = await api.imageDeblur.getDeblurHistory.useQuery({
  limit: 20,
  offset: 0
});
```

#### 响应格式
```typescript
interface DeblurHistoryItem {
  id: string;
  userId: string;
  prompt: string;           // 请求描述
  imageUrl: string;         // 图片 URL (可能为空，因为改为本地缓存)
  requestId: string;        // MagicAPI 请求 ID
  status: "processing" | "completed" | "failed";
  createdAt: Date;
}

type GetDeblurHistoryResponse = DeblurHistoryItem[];
```

#### 响应示例
```json
[
  {
    "id": "img_789xyz",
    "userId": "user_abc123",
    "prompt": "Image deblurring request",
    "imageUrl": "",
    "requestId": "req_abc123def456",
    "status": "completed",
    "createdAt": "2024-06-29T10:30:00Z"
  },
  {
    "id": "img_456def",
    "userId": "user_abc123",
    "prompt": "Image deblurring request",
    "imageUrl": "",
    "requestId": "req_def456ghi789",
    "status": "processing",
    "createdAt": "2024-06-29T09:15:00Z"
  }
]
```

---

## 🔄 MagicAPI 集成

### 外部 API 调用

#### 提交处理请求
```http
POST https://api.market/magicapi/deblurer/process
Content-Type: application/json
x-magicapi-key: [API_KEY]

{
  "image_url": "https://example.com/image.jpg"
}
```

**响应**:
```json
{
  "request_id": "req_abc123def456"
}
```

#### 查询处理状态
```http
GET https://api.market/magicapi/deblurer/{request_id}
x-magicapi-key: [API_KEY]
```

**响应**:
```json
{
  "status": "completed",
  "image_url": "https://api.market/results/deblurred-abc123.jpg"
}
```

---

## 📊 业务逻辑

### 积分系统
```typescript
// 积分消耗规则
const CREDIT_COST_DEBLUR = 1; // 每次去模糊消耗 1 积分

// 积分检查
function hasEnoughCredits(balance: number, cost: number): boolean {
  return balance >= cost;
}

// 积分扣除
function calculateRemainingCredits(balance: number, cost: number): number {
  return Math.max(0, balance - cost);
}
```

### 数据库操作

#### 创建处理记录
```sql
INSERT INTO images (userId, prompt, requestId, status)
VALUES (?, 'Image deblurring request', ?, 'processing');
```

#### 更新处理状态
```sql
UPDATE images
SET status = ?
WHERE id = ?;
```

#### 更新用户积分
```sql
UPDATE users
SET creditBalance = ?
WHERE id = ?;
```

---

## 🔧 错误处理

### 错误代码对照表

| 错误代码 | HTTP状态码 | 说明 |
|---------|-----------|------|
| `UNAUTHORIZED` | 401 | 用户未登录或会话无效 |
| `FORBIDDEN` | 403 | 积分不足或权限不够 |
| `NOT_FOUND` | 404 | 用户或资源不存在 |
| `BAD_REQUEST` | 400 | 请求参数无效 |
| `INTERNAL_SERVER_ERROR` | 500 | 服务器内部错误 |

### 常见错误场景

1. **图片 URL 无效**
   ```json
   {
     "code": "BAD_REQUEST",
     "message": "Invalid image URL format"
   }
   ```

2. **MagicAPI 调用失败**
   ```json
   {
     "code": "INTERNAL_SERVER_ERROR",
     "message": "Failed to submit image for deblurring: API rate limit exceeded"
   }
   ```

3. **数据库连接失败**
   ```json
   {
     "code": "INTERNAL_SERVER_ERROR",
     "message": "Database connection failed"
   }
   ```

---

## 🚀 前端集成示例

### React Hook 使用

#### 提交处理
```typescript
import { api } from "~/trpc/react";

function useImageDeblur() {
  const submitMutation = api.imageDeblur.submitDeblur.useMutation({
    onSuccess: (data) => {
      console.log('提交成功:', data);
      // 开始轮询状态
    },
    onError: (error) => {
      console.error('提交失败:', error.message);
    }
  });

  const submit = (imageUrl: string) => {
    submitMutation.mutate({ image_url: imageUrl });
  };

  return {
    submit,
    isSubmitting: submitMutation.isPending,
    error: submitMutation.error
  };
}
```

#### 状态轮询
```typescript
function useDeblurStatus(requestId: string, enabled: boolean) {
  return api.imageDeblur.getDeblurStatus.useQuery(
    { requestId },
    {
      enabled,
      refetchInterval: (data) => {
        // 完成或失败时停止轮询
        if (data?.status === 'completed' || data?.status === 'failed') {
          return false;
        }
        return 3000; // 3秒间隔
      }
    }
  );
}
```

#### 历史记录
```typescript
function useDeblurHistory(page = 0, limit = 10) {
  return api.imageDeblur.getDeblurHistory.useQuery({
    offset: page * limit,
    limit
  });
}
```

---

## 📈 性能考虑

### 轮询优化
- **智能间隔**: 根据状态调整轮询频率
- **自动停止**: 完成后立即停止轮询
- **错误重试**: 网络错误时自动重试

### 缓存策略
- **客户端缓存**: tRPC 自动缓存查询结果
- **本地图片缓存**: Blob URL 缓存处理结果
- **状态缓存**: 避免重复查询相同状态

### 资源清理
- **Blob URL 清理**: 定期清理过期的 blob URLs
- **内存管理**: 及时释放不需要的图片资源

---

## 🔒 安全考虑

### 输入验证
- URL 格式验证
- 文件类型检查
- 大小限制

### 权限控制
- 用户会话验证
- 积分余额检查
- 频率限制

### 数据保护
- 不存储用户图片内容
- 仅保存元数据和状态
- 本地缓存自动过期
