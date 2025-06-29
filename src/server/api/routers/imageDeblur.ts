import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// MagicAPI Deblurer schema
export const imageDeblurSchema = z.object({
  image_url: z
    .string()
    .url()
    .describe("URL of the blurred image to be processed"),
});

// API Response types
interface SubmitDeblurResponse {
  request_id: string;
}

interface DeblurStatusResponse {
  status: string;
  result?: string; // 根据API文档，成功后返回的是result字段
  error?: string;
}

interface ApiErrorResponse {
  error: string;
}

// API基础URL和请求头
const API_BASE_URL = "https://api.magicapi.dev/api/v1/magicapi/deblurer";
const getHeaders = () => ({
  accept: "application/json",
  "x-magicapi-key": env.MAGICAPI_KEY,
  "Content-Type": "application/json",
});

// 处理API错误的辅助函数
const handleApiError = async (
  response: Response,
  operation: string,
): Promise<never> => {
  let errorMessage = response.statusText;

  try {
    const errorText = await response.text();
    if (errorText) {
      try {
        const errorData = JSON.parse(errorText) as ApiErrorResponse;
        errorMessage = errorData.error ?? errorMessage;
      } catch {
        errorMessage = errorText;
      }
    }
  } catch {
    // 如果读取响应体失败，继续使用状态文本
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Failed to ${operation}: ${errorMessage}`,
  });
};

// MagicAPI service functions
async function submitImageForDeblur(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/deblurer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        image: imageUrl, // 根据API文档，参数名是image而不是image_url
      }),
    });

    if (!response.ok) {
      await handleApiError(response, "submit image for deblurring");
    }

    const data = (await response.json()) as SubmitDeblurResponse;
    return data.request_id;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to submit image for deblurring: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

async function getDeblurResult(
  requestId: string,
): Promise<{ status: string; image_url?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/${requestId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response, "get deblur result");
    }

    const data = (await response.json()) as DeblurStatusResponse;

    // 根据API文档转换响应格式
    return {
      status: data.status,
      image_url: data.result, // API返回的是result字段，我们转换为image_url以保持内部一致性
      error: data.error,
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get deblur result: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

export const imageDeblurRouter = createTRPCRouter({
  // Submit image for deblurring
  submitDeblur: publicProcedure
    .input(imageDeblurSchema)
    .mutation(async ({ input }) => {
      try {
        // Submit image to MagicAPI for deblurring
        const requestId = await submitImageForDeblur(input.image_url);

        return {
          success: true,
          requestId: requestId,
          originalUrl: input.image_url,
        };
      } catch (error) {
        // 捕获所有错误并转换为TRPC错误
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process image",
        });
      }
    }),

  // Check deblur status and get result
  getDeblurStatus: publicProcedure
    .input(z.object({ requestId: z.string() }))
    .query(async ({ input }) => {
      try {
        // Get result from MagicAPI
        const result = await getDeblurResult(input.requestId);

        // 将API的状态映射到我们的内部状态
        const mappedStatus = 
          result.status === "succeeded"
            ? "completed"
            : result.status === "failed"
              ? "failed"
              : "processing";

        return {
          ...result,
          status: mappedStatus, // 使用映射后的状态
          // Add expiration warning for frontend
          expires_in_minutes: result.status === "succeeded" ? 10 : undefined,
          warning:
            result.status === "succeeded"
              ? "Processed image URL expires in 10 minutes. Download or cache locally."
              : undefined,
        };
      } catch (error) {
        // 捕获所有错误并转换为TRPC错误
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to get deblur status",
        });
      }
    }),
});
