import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { billings, images, users, deblurRequests } from "./schema";

// Base Types from Schema
export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export type SelectImage = InferSelectModel<typeof images>;
export type InsertImage = InferInsertModel<typeof images>;
export type SelectBilling = InferSelectModel<typeof billings>;
export type InsertBilling = InferInsertModel<typeof billings>;
export type SelectDeblurRequest = InferSelectModel<typeof deblurRequests>;
export type InsertDeblurRequest = InferInsertModel<typeof deblurRequests>;
