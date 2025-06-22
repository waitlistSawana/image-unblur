import "server-only";

import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export function TRPCErrorResponse({
  code,
  message,
  cause,
  request,
}: {
  code: TRPCError["code"];
  message: TRPCError["message"];
  cause?: TRPCError["cause"];
  request: NextRequest;
}) {
  const path = request?.nextUrl.pathname ?? "<no-path>";

  const error = new TRPCError({
    code,
    message,
    ...(cause && { cause: cause }),
  });

  if (env.NODE_ENV === "development") {
    console.error(`❌ Api route failed on ${path}: ${message}`);
  }

  return NextResponse.json(
    {
      name: error.name,
      cause: error.cause,
      message: error.message,
      code: error.code,
      stack: error.stack,
    },
    {
      status: getHTTPStatusCodeFromError(error),
      statusText: error.code,
    },
  );
}
