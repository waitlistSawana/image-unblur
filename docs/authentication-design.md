# ImageUnblur.site 权限设计文档

## 📋 权限设计原则

### 🌍 前端页面权限

**原则：前端页面仅查看是不需要登录的**

#### ✅ 公共页面（无需登录）
- `/` - 首页
- `/image-deblur` - 图像去模糊页面（可查看界面）
- `/pricing` - 定价页面
- `/examples` - 示例页面查看
- `/text-to-image` - 文本生成图像页面（可查看界面）
- `/sign-in` - 登录页面
- `/sign-up` - 注册页面

#### 🔒 受保护页面（需要登录）
目前没有必须登录才能查看的页面，所有页面都允许访客查看

### 🔧 后端路由权限

**原则：后端路由必要时需要验证登录，尤其涉及积分的**

#### ✅ 公共 API（无需登录）
- `imageDeblur.getDeblurStatus` - 查询去模糊状态
- 其他只读查询 API

#### 🔒 受保护 API（需要登录）
- `imageDeblur.submitDeblur` - 提交去模糊请求（涉及积分扣除）
- `imageDeblur.getDeblurHistory` - 获取用户历史记录
- `generateImage.*` - 所有图像生成 API（涉及积分）
- `billing.*` - 所有计费相关 API
- `credit.*` - 所有积分相关 API

## 🏗 实现架构

### Middleware 配置
```typescript
// 仅保护特定路由，其他页面允许访客查看
const isProtectedRoute = createRouteMatcher([
  "/examples" // 如果需要的话
]);
```

### API 路由类型
```typescript
// 公共 API - 无需登录
publicProcedure

// 受保护 API - 需要登录，通常涉及：
// - 积分操作
// - 用户数据
// - 付费功能
protectedProcedure
```

### 前端权限检查
```typescript
// 在组件中，只在实际使用功能时检查登录状态
const handleSubmit = async (data) => {
  if (!isSignedIn) {
    openSignIn(); // 引导用户登录
    return;
  }
  // 执行需要登录的操作
};
```

## 📊 权限检查点

### 1. 积分相关操作
- ✅ **必须登录**：扣除积分、查询余额、购买积分
- ❌ **无需登录**：查看定价信息

### 2. 图像处理操作
- ✅ **必须登录**：提交处理请求（消耗积分）
- ❌ **无需登录**：查看处理结果、查询状态

### 3. 用户数据操作
- ✅ **必须登录**：查看历史记录、个人设置
- ❌ **无需登录**：查看公共示例

## 🔄 用户体验流程

### 访客用户（未登录）
1. 可以查看所有页面和界面
2. 可以上传图片并预览界面
3. 点击"开始处理"时提示登录
4. 登录后继续操作

### 登录用户
1. 享受所有功能
2. 可以提交处理请求
3. 消耗积分进行操作
4. 查看历史记录

## 🚫 安全考虑

### 前端安全
- 前端权限检查仅用于用户体验
- 不依赖前端检查作为安全屏障
- 敏感信息不在前端暴露

### 后端安全
- 所有敏感操作在后端验证权限
- 积分操作必须验证用户身份
- API 密钥和敏感数据只在服务端使用

## 📝 更新记录

- **2024-06-29**: 初始权限设计文档
- **修订**: 将 image-deblur 页面改为公共访问，API 级别控制权限
