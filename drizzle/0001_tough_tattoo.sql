CREATE TYPE "public"."billing_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."billing_type" AS ENUM('subscription_new', 'subscription_renewal', 'credits_purchase', 'bonus_credit_grant', 'credit_refund', 'subscription_refund');--> statement-breakpoint
CREATE TYPE "public"."display_status" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."model" AS ENUM('black-forest-labs/flux-kontext-pro', 'upload');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'basic', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."upload_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "ai-image-generator-starter_billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"clerkId" varchar(256) NOT NULL,
	"type" "billing_type" NOT NULL,
	"status" "billing_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"creditAmount" integer,
	"bonusCreditAmount" integer,
	"stripePaymentIntentId" varchar(256),
	"receiptUrl" varchar(256),
	"planType" "plan",
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"paidAt" timestamp with time zone,
	"relatedBillingId" uuid,
	CONSTRAINT "ai-image-generator-starter_billing_stripePaymentIntentId_unique" UNIQUE("stripePaymentIntentId")
);
--> statement-breakpoint
CREATE TABLE "ai-image-generator-starter_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"clerkId" varchar(256) NOT NULL,
	"uploadStatus" "upload_status" DEFAULT 'pending' NOT NULL,
	"displayStatus" "display_status" DEFAULT 'public',
	"name" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"width" integer,
	"height" integer,
	"shape" varchar(16),
	"size" bigint,
	"prompt" text,
	"modelUsed" "model",
	"usage" integer,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ai-image-generator-starter_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkId" varchar(256),
	"email" varchar(256),
	"credit" integer DEFAULT 0,
	"bonusCredit" integer DEFAULT 0,
	"plan" "plan" DEFAULT 'free',
	"stripeCustomerId" varchar(256),
	"stripeSubscriptionId" varchar(256),
	"stripeSubscriptionCurrentPeriodEnd" timestamp with time zone,
	"stripePriceId" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "ai-image-generator-starter_user_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "ai-image-generator-starter_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai-image-generator-starter_billing" ADD CONSTRAINT "billing_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai-image-generator-starter_user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ai-image-generator-starter_billing" ADD CONSTRAINT "billing_related_billing_fk" FOREIGN KEY ("relatedBillingId") REFERENCES "public"."ai-image-generator-starter_billing"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ai-image-generator-starter_image" ADD CONSTRAINT "image_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai-image-generator-starter_user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "billing_clerkId_idx" ON "ai-image-generator-starter_billing" USING btree ("clerkId");--> statement-breakpoint
CREATE INDEX "billing_status_idx" ON "ai-image-generator-starter_billing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "billing_createdAt_idx" ON "ai-image-generator-starter_billing" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "image_clerkId_idx" ON "ai-image-generator-starter_image" USING btree ("clerkId");--> statement-breakpoint
CREATE INDEX "image_createdAt_idx" ON "ai-image-generator-starter_image" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "user_clerkId_idx" ON "ai-image-generator-starter_user" USING btree ("clerkId");--> statement-breakpoint
CREATE INDEX "user_credit_bonus_credit_idx" ON "ai-image-generator-starter_user" USING btree ("credit","bonusCredit");--> statement-breakpoint
CREATE INDEX "user_plan_idx" ON "ai-image-generator-starter_user" USING btree ("plan");--> statement-breakpoint
CREATE INDEX "user_createdAt_idx" ON "ai-image-generator-starter_user" USING btree ("createdAt");