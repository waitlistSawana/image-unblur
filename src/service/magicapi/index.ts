import { env } from "~/env";

const MAGICAPI_BASE_URL = "https://api.market/magicapi/deblurer";

export interface DeblurRequest {
  image_url: string;
}

export interface DeblurSubmitResponse {
  request_id: string;
}

export interface DeblurResultResponse {
  status: string;
  image_url?: string;
}

export interface DeblurErrorResponse {
  error: string;
}

/**
 * Submit an image for deblurring processing
 */
export async function submitImageDeblur(imageUrl: string): Promise<DeblurSubmitResponse> {
  const response = await fetch(`${MAGICAPI_BASE_URL}/process`, {
    method: "POST",
    headers: {
      "x-magicapi-key": env.MAGICAPI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as DeblurErrorResponse;
    throw new Error(`MagicAPI Error: ${errorData.error || "Unknown error"}`);
  }

  return response.json() as Promise<DeblurSubmitResponse>;
}

/**
 * Get the result of a deblurring request
 */
export async function getDeblurResult(requestId: string): Promise<DeblurResultResponse> {
  const response = await fetch(`${MAGICAPI_BASE_URL}/${requestId}`, {
    method: "GET",
    headers: {
      "x-magicapi-key": env.MAGICAPI_KEY,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as DeblurErrorResponse;
    throw new Error(`MagicAPI Error: ${errorData.error || "Unknown error"}`);
  }

  return response.json() as Promise<DeblurResultResponse>;
}

/**
 * Poll for deblur result with timeout
 */
export async function pollDeblurResult(
  requestId: string,
  maxAttempts: number = 30,
  interval: number = 2000,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getDeblurResult(requestId);

    if (result.status === "completed" && result.image_url) {
      return result.image_url;
    }

    if (result.status === "failed") {
      throw new Error("Image deblurring failed");
    }

    // If still processing, wait before next attempt
    if (i < maxAttempts - 1) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  throw new Error("Deblurring timeout - please try again");
}
