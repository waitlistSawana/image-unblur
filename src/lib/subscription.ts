import "server-only";

// TODO: 使用 jest 测试

/**
 * 判断用户是否需要刷新积分，并返回相关的检查点时间
 *
 * @param plan 用户的订阅计划
 * @param stripeSubscriptionCurrentPeriodEnd 当前订阅周期结束时间
 * @param stripeSubscriptionCycleAnchor 订阅周期锚点
 * @param lastRefreshCredit 上次刷新积分的时间
 * @returns 包含是否应刷新积分的布尔值，以及前一个和后一个检查点时间
 */
export function checkCreditRefreshStatus(
  plan: string,
  stripeSubscriptionCurrentPeriodEnd: Date | null,
  stripeSubscriptionCycleAnchor: Date | null,
  lastRefreshCredit: Date | null,
): {
  shouldRefresh: boolean;
  previousCheckpoint: Date | null;
  nextCheckpoint: Date | null;
} {
  const now = new Date();

  // 默认返回值
  const defaultResult = {
    shouldRefresh: false,
    previousCheckpoint: null,
    nextCheckpoint: null,
  };

  // 检查用户是否是有效的付费会员
  if (
    plan === "free" ||
    !stripeSubscriptionCurrentPeriodEnd ||
    now >= stripeSubscriptionCurrentPeriodEnd ||
    !stripeSubscriptionCycleAnchor
  ) {
    return defaultResult;
  }

  const anchor = new Date(stripeSubscriptionCycleAnchor);

  // 创建检查点函数 - 保留原始时间部分，只调整年月
  const createCheckpoint = (year: number, month: number): Date => {
    // 尝试创建指定年月的检查点
    const date = new Date(
      Date.UTC(
        year,
        month,
        anchor.getUTCDate(),
        anchor.getUTCHours(),
        anchor.getUTCMinutes(),
        anchor.getUTCSeconds(),
        anchor.getUTCMilliseconds(),
      ),
    );

    // 如果月份不匹配（日期溢出），则使用该月的最后一天
    if (date.getUTCMonth() !== month) {
      return new Date(
        Date.UTC(
          year,
          month + 1,
          0, // 月的最后一天
          anchor.getUTCHours(),
          anchor.getUTCMinutes(),
          anchor.getUTCSeconds(),
          anchor.getUTCMilliseconds(),
        ),
      );
    }

    return date;
  };

  // 计算当前月和相邻月份的检查点
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  const currentMonthCheckpoint = createCheckpoint(currentYear, currentMonth);
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousCheckpoint = createCheckpoint(prevYear, prevMonth);
  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextCheckpoint = createCheckpoint(nextYear, nextMonth);

  // 判断是否需要刷新
  const lastRefresh = lastRefreshCredit ? new Date(lastRefreshCredit) : null;

  // 如果当前时间已过当月检查点，检查是否需要在当月刷新
  if (now >= currentMonthCheckpoint) {
    return {
      shouldRefresh: !lastRefresh || lastRefresh < currentMonthCheckpoint,
      previousCheckpoint,
      nextCheckpoint,
    };
  }
  // 如果当前时间未到当月检查点，检查是否需要基于上月检查点刷新
  else {
    return {
      shouldRefresh: !lastRefresh || lastRefresh < previousCheckpoint,
      previousCheckpoint,
      nextCheckpoint: currentMonthCheckpoint,
    };
  }
}
