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
