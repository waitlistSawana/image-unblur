// TODO: 使用 jest 测试

/**
 * 计算消耗积分后的剩余积分
 * 优先消耗 credit，不足时再消耗 bonusCredit
 *
 * @param credit 当前常规积分
 * @param bonusCredit 当前奖励积分
 * @param consumeAmount 需要消耗的积分数量
 * @returns 消耗后的积分对象 { credit, bonusCredit }
 */
export function calculateRemainingCredits(
  credit = 0,
  bonusCredit = 0,
  consumeAmount = 1,
): { credit: number; bonusCredit: number } {
  // 确保所有值为非负数
  const safeCredit = Math.max(0, credit);
  const safeBonusCredit = Math.max(0, bonusCredit);
  const safeConsumeAmount = Math.max(0, consumeAmount);

  // 如果没有积分可消耗，直接返回原值
  if (safeConsumeAmount === 0) {
    return { credit: safeCredit, bonusCredit: safeBonusCredit };
  }

  // 如果常规积分足够
  if (safeCredit >= safeConsumeAmount) {
    return {
      credit: safeCredit - safeConsumeAmount,
      bonusCredit: safeBonusCredit,
    };
  }

  // 常规积分不足，需要消耗部分或全部奖励积分
  const remainingToConsume = safeConsumeAmount - safeCredit;
  const newBonusCredit = Math.max(0, safeBonusCredit - remainingToConsume);

  return {
    credit: 0, // 常规积分已全部消耗
    bonusCredit: newBonusCredit,
  };
}

/**
 * 检查用户是否有足够的积分
 *
 * @param credit 当前常规积分
 * @param bonusCredit 当前奖励积分
 * @param requiredAmount 需要的积分数量
 * @returns 是否有足够积分
 */
export function hasEnoughCredits(
  credit = 0,
  bonusCredit = 0,
  requiredAmount = 1,
): boolean {
  const totalAvailable = Math.max(0, credit) + Math.max(0, bonusCredit);
  return totalAvailable >= requiredAmount;
}

/**
 * 判断用户是否需要刷新积分，并返回相关的检查点时间
 *
 * @param plan 用户的订阅计划
 * @param stripeSubscriptionCurrentPeriodEnd 当前订阅周期结束时间
 * @param stripeSubscriptionCycleAnchor 订阅周期锚点
 * @param lastRefreshCredit 上次刷新积分的时间
 * @returns 包含是否应刷新积分的布尔值，以及前一个和后一个检查点时间
 */
export function checkCreditRefreshStatus({
  plan,
  stripeSubscriptionCurrentPeriodEnd,
  stripeSubscriptionCycleAnchor,
  lastRefreshCredit,
}: {
  plan: string;
  stripeSubscriptionCurrentPeriodEnd: Date | null;
  stripeSubscriptionCycleAnchor: Date | null;
  lastRefreshCredit: Date | null;
}): {
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
