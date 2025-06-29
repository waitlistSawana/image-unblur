// 图片本地缓存工具函数

interface CachedImage {
  blobUrl: string;
  originalUrl: string;
  timestamp: number;
  expiresAt: number;
}

// 内存缓存存储
const imageCache = new Map<string, CachedImage>();

/**
 * 下载远程图片并转换为本地 blob URL
 * @param imageUrl 远程图片 URL
 * @param cacheKey 缓存键名
 * @returns 本地 blob URL
 */
export async function downloadAndCacheImage(
  imageUrl: string,
  cacheKey: string,
): Promise<string> {
  console.log(
    `Attempting to download and cache image: ${imageUrl} with key: ${cacheKey}`,
  );

  try {
    // 检查是否已经缓存且未过期
    const cached = imageCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      console.log(`Using cached image for key: ${cacheKey}`);
      return cached.blobUrl;
    }

    console.log(`Fetching image from: ${imageUrl}`);

    // 下载图片
    const response = await fetch(imageUrl, {
      mode: "cors",
      credentials: "omit",
      headers: {
        // 某些服务可能需要这些头
        Accept: "image/*",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to download image: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `Failed to download image: ${response.status} ${response.statusText}`,
      );
    }

    console.log(
      `Image downloaded successfully, content-type: ${response.headers.get("content-type")}`,
    );

    const blob = await response.blob();
    console.log(`Blob created: ${blob.size} bytes, type: ${blob.type}`);

    const blobUrl = URL.createObjectURL(blob);
    console.log(`Blob URL created: ${blobUrl}`);

    // 缓存图片（设置24小时过期）
    const cachedImage: CachedImage = {
      blobUrl,
      originalUrl: imageUrl,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时
    };

    // 清理旧的 blob URL
    if (cached) {
      console.log(`Revoking old blob URL for key: ${cacheKey}`);
      URL.revokeObjectURL(cached.blobUrl);
    }

    imageCache.set(cacheKey, cachedImage);
    console.log(`Image cached successfully for key: ${cacheKey}`);

    return blobUrl;
  } catch (error) {
    console.error("Failed to download and cache image:", error);

    // 尝试直接使用原始URL
    console.log(`Falling back to original URL: ${imageUrl}`);

    // 如果下载失败，返回原始 URL
    return imageUrl;
  }
}

/**
 * 从缓存中获取图片 blob URL
 * @param cacheKey 缓存键名
 * @returns blob URL 或 undefined
 */
export function getCachedImageUrl(cacheKey: string): string | undefined {
  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.blobUrl;
  }
  return undefined;
}

/**
 * 清理过期的缓存图片
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();

  for (const [key, cached] of imageCache.entries()) {
    if (now >= cached.expiresAt) {
      URL.revokeObjectURL(cached.blobUrl);
      imageCache.delete(key);
    }
  }
}

/**
 * 清理所有缓存图片
 */
export function clearAllCache(): void {
  for (const cached of imageCache.values()) {
    URL.revokeObjectURL(cached.blobUrl);
  }
  imageCache.clear();
}

/**
 * 保存图片到本地浏览器存储
 * @param blobUrl blob URL
 * @param filename 文件名
 */
export function saveImageToLocal(blobUrl: string, filename: string): void {
  try {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to save image locally:", error);
  }
}

// 定期清理过期缓存
if (typeof window !== "undefined") {
  setInterval(cleanupExpiredCache, 60 * 60 * 1000); // 每小时清理一次
}
