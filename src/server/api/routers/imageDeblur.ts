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
  image_url?: string; // 可能的字段名
  result?: string; // 可能的字段名
  output?: string; // 实际API返回的字段名
  error?: string;
}

interface ApiErrorResponse {
  error: string;
}

// API基础URL和请求头
const API_BASE_URL = "https://prod.api.market/api/v1/magicapi/deblurer";
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
  let errorCode: TRPCError["code"] = "INTERNAL_SERVER_ERROR";

  // 根据HTTP状态码映射到TRPC错误代码
  switch (response.status) {
    case 400:
      errorCode = "BAD_REQUEST";
      break;
    case 401:
      errorCode = "UNAUTHORIZED";
      break;
    case 403:
      errorCode = "FORBIDDEN";
      break;
    case 404:
      errorCode = "NOT_FOUND";
      break;
    case 429:
      errorCode = "TOO_MANY_REQUESTS";
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorCode = "INTERNAL_SERVER_ERROR";
      break;
    default:
      // 默认使用INTERNAL_SERVER_ERROR
      errorCode = "INTERNAL_SERVER_ERROR";
  }

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

  console.error(
    `API Error (${response.status} ${response.statusText}): ${errorMessage}`,
  );

  throw new TRPCError({
    code: errorCode,
    message: `Failed to ${operation}: ${errorMessage}`,
  });
};

// MagicAPI service functions
async function submitImageForDeblur(imageUrl: string): Promise<string> {
  try {
    console.log("Submitting image to MagicAPI:", imageUrl);

    const response = await fetch(`${API_BASE_URL}/deblurer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        image: imageUrl, // 根据API文档，参数名是image而不是image_url
        task_type: "Image Debluring (REDS)", // 添加task_type参数
      }),
    });

    if (!response.ok) {
      console.error(
        "MagicAPI error response:",
        response.status,
        response.statusText,
      );
      await handleApiError(response, "submit image for deblurring");
    }

    const data = (await response.json()) as SubmitDeblurResponse;
    console.log("MagicAPI submit response:", data);
    return data.request_id;
  } catch (error) {
    console.error("Error submitting to MagicAPI:", error);
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
    console.log("Checking status for request:", requestId);

    const response = await fetch(`${API_BASE_URL}/predictions/${requestId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error(
        "MagicAPI status error:",
        response.status,
        response.statusText,
      );
      await handleApiError(response, "get deblur result");
    }

    const data = (await response.json()) as DeblurStatusResponse;
    console.log("MagicAPI status response:", data);

    // Add detailed debugging for the response structure
    console.log("MagicAPI response structure:", {
      status: data.status,
      image_url: data.image_url,
      result: data.result,
      output: data.output,
      error: data.error,
      fullResponse: JSON.stringify(data),
    });

    // Check which field contains the image URL
    const imageUrl = data.image_url ?? data.result ?? data.output;

    // 根据API文档直接返回响应数据
    return {
      status: data.status,
      image_url: imageUrl, // Use any of the possible fields that contains the URL
      error: data.error,
    };
  } catch (error) {
    console.error("Error getting status from MagicAPI:", error);
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
          message:
            error instanceof Error ? error.message : "Failed to process image",
        });
      }
    }),

  // Check deblur status and get result
  getDeblurStatus: publicProcedure
    .input(z.object({ requestId: z.string() }))
    .query(async ({ input }) => {
      try {
        // 检查requestId是否为空
        if (!input.requestId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Request ID is required",
          });
        }

        // Get result from MagicAPI
        const result = await getDeblurResult(input.requestId);

        console.log("Processing result before mapping:", result);

        // 将API的状态映射到我们的内部状态
        const mappedStatus =
          result.status === "succeeded"
            ? "completed"
            : result.status === "failed"
              ? "failed"
              : "processing";

        const responseObj = {
          ...result,
          status: mappedStatus, // 使用映射后的状态
          // Add expiration warning for frontend
          expires_in_minutes: result.status === "succeeded" ? 10 : undefined,
          warning:
            result.status === "succeeded"
              ? "Processed image URL expires in 10 minutes. Download or cache locally."
              : undefined,
        };

        console.log("Final response object:", responseObj);
        return responseObj;
      } catch (error) {
        // 捕获所有错误并转换为TRPC错误
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get deblur status",
        });
      }
    }),
});
