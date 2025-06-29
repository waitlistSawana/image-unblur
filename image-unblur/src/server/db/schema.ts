// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { foreignKey, index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `ai-image-generator-starter_${name}`,
);

// Enum
export const planEnum = pgEnum("plan", ["free", "basic", "pro", "enterprise"]);
export const uploadStatusEnum = pgEnum("upload_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);
export const modelEnum = pgEnum("model", [
  "black-forest-labs/flux-kontext-pro",
  "upload",
]);
export const displayStatusEnum = pgEnum("display_status", [
  "public",
  "private",
]);

// 测试用 不要删除
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const users = createTable(
  "user",
  (d) => ({
    // ids
    id: d.uuid().primaryKey().defaultRandom(),
    clerkId: d.varchar({ length: 256 }).unique().notNull(),
    email: d.varchar({ length: 256 }).unique(),
    // subscription
    credit: d.integer().default(0),
    bonusCredit: d.integer().default(0),
    plan: planEnum().default("free"),
    lastRefreshCredit: d.timestamp({ withTimezone: true }),
    // Stripe
    stripeCustomerId: d.varchar({ length: 256 }),
    stripeSubscriptionId: d.varchar({ length: 256 }),
    stripeSubscriptionCurrentPeriodEnd: d.timestamp({ withTimezone: true }),
    stripeSubscriptionCycleAnchor: d.timestamp({ withTimezone: true }), // 订阅周期锚点
    stripePriceId: d.varchar({ length: 256 }),
    // timestamps
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("user_clerkId_idx").on(t.clerkId),
    index("user_credit_bonus_credit_idx").on(t.credit, t.bonusCredit),
    index("user_plan_idx").on(t.plan),
    index("user_createdAt_idx").on(t.createdAt),
  ],
);

export const images = createTable(
  "image",
  (d) => ({
    // ids
    id: d.uuid().primaryKey().defaultRandom(),
    userId: d.uuid().notNull(),
    clerkId: d.varchar({ length: 256 }).notNull(),
    // status
    uploadStatus: uploadStatusEnum().default("pending").notNull(),
    displayStatus: displayStatusEnum().default("public"),
    // metadata
    name: d.varchar({ length: 256 }).notNull(),
    url: d.varchar({ length: 256 }).notNull(),
    width: d.integer(),
    height: d.integer(),
    shape: d.varchar({ length: 16 }),
    size: d.bigint({ mode: "bigint" }),
    // ai generated
    prompt: d.text(),
    modelUsed: modelEnum(),
    usage: d.integer(),
    // timestamps
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("image_clerkId_idx").on(t.clerkId),
    index("image_createdAt_idx").on(t.createdAt),
    // foreign keys
    foreignKey({
      name: "image_user_fk",
      columns: [t.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const billingTypeEnum = pgEnum("billing_type", [
  "subscription_new", // 新订阅
  "subscription_renewal", // 续订
  "credits_purchase", // 购买常规积分
  "bonus_credit_grant", // 赠送奖励积分
  "credit_refund", // 积分退款
  "subscription_refund", // 订阅退款
]);

export const billingStatusEnum = pgEnum("billing_status", [
  "pending", // 待支付
  "completed", // 已完成
  "failed", // 失败
  "refunded", // 已退款
]);

export const billings = createTable(
  "billing",
  (d) => ({
    // 基本信息
    id: d.uuid().primaryKey().defaultRandom(),
    userId: d.uuid().notNull(),
    clerkId: d.varchar({ length: 256 }).notNull(),
    // 交易类型和状态
    type: billingTypeEnum().notNull(),
    status: billingStatusEnum().default("pending").notNull(),
    // 金额信息
    amount: d.integer().notNull(), // 以分为单位 eg. 4999 -> 49.99
    currency: d.varchar({ length: 3 }).default("USD").notNull(),
    // 积分相关
    creditAmount: d.integer(), // 购买的常规积分数量
    bonusCreditAmount: d.integer(), // 奖励积分数量
    // Stripe 相关
    stripePaymentIntentId: d.varchar({ length: 256 }).unique(),
    receiptUrl: d.varchar({ length: 256 }),
    // 订阅相关（仅当type为subscription相关时有值）
    planType: planEnum(),
    // 时间戳
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    paidAt: d.timestamp({ withTimezone: true }),
    // 关联信息
    relatedBillingId: d.uuid(), // 用于关联退款等相关交易
  }),
  (t) => [
    // 索引
    index("billing_clerkId_idx").on(t.clerkId),
    index("billing_status_idx").on(t.status),
    index("billing_createdAt_idx").on(t.createdAt),
    // 外键关系
    foreignKey({
      name: "billing_user_fk",
      columns: [t.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    // 自引用外键（用于关联退款）
    foreignKey({
      name: "billing_related_billing_fk",
      columns: [t.relatedBillingId],
      foreignColumns: [t.id],
    })
      .onDelete("set null")
      .onUpdate("cascade"),
  ],
);
