"use client";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Coins } from "lucide-react";
import { api } from "~/trpc/react";
import { useClerk } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";

interface CreditButtonProps {
  className?: string;
}

export default function CreditButton({
  className,
  ...props
}: React.ComponentProps<"button"> & CreditButtonProps) {
  const { isSignedIn, loaded, openSignIn } = useClerk();

  // 只有在已加载且已登录的情况下才请求数据
  const {
    data: creditData,
    isPending,
    isFetching,
    isError,
    refetch,
  } = api.credit.getUserCredit.useQuery(
    undefined, // 不需要传递参数
    {
      // 只有在已加载且已登录时才启用查询
      enabled: loaded && isSignedIn,
    },
  );

  // 如果未加载，显示loading state
  if (!loaded) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("", className)}
        {...props}
      >
        <Coins className="h-4 w-4" />
        <Skeleton className="h-5 w-8 rounded-md" />
      </Button>
    );
  }

  // 如果未登录，显示登录按钮
  if (!isSignedIn) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          openSignIn();
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        <Coins className="h-4 w-4" />
        <p>Sign-In</p>
      </Button>
    );
  }

  // 如果正在加载数据，显示加载状态
  if (isPending || isFetching) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("", className)}
        {...props}
      >
        <Coins className="h-4 w-4" />
        <Skeleton className="h-5 w-8 rounded-md" />
      </Button>
    );
  }

  // 如果发生错误，显示错误状态并提供重试按钮
  if (isError) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("cursor-pointer", className)}
        onClick={() => refetch()}
        {...props}
      >
        <Coins className="h-4 w-4" />
        <span className="text-xs">Reload</span>
      </Button>
    );
  }

  // 显示积分
  return (
    <Button
      type="button"
      variant="outline"
      className={cn("", className)}
      onClick={() => refetch()}
      {...props}
    >
      <Coins className="h-4 w-4" />
      {creditData.totalCredit}
    </Button>
  );
}
