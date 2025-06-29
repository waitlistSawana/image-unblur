CREATE TYPE "public"."deblur_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "ai-image-generator-starter_deblur_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"clerkId" varchar(256) NOT NULL,
	"requestId" varchar(256) NOT NULL,
	"status" "deblur_status" DEFAULT 'pending' NOT NULL,
	"originalImageUrl" varchar(512) NOT NULL,
	"processedImageUrl" varchar(512),
	"processingStartedAt" timestamp with time zone,
	"processingCompletedAt" timestamp with time zone,
	"expiresAt" timestamp with time zone,
	"creditsCost" integer DEFAULT 1 NOT NULL,
	"errorMessage" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "ai-image-generator-starter_deblur_request_requestId_unique" UNIQUE("requestId")
);
--> statement-breakpoint
ALTER TABLE "ai-image-generator-starter_deblur_request" ADD CONSTRAINT "deblur_request_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai-image-generator-starter_user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "deblur_request_clerkId_idx" ON "ai-image-generator-starter_deblur_request" USING btree ("clerkId");--> statement-breakpoint
CREATE INDEX "deblur_request_requestId_idx" ON "ai-image-generator-starter_deblur_request" USING btree ("requestId");--> statement-breakpoint
CREATE INDEX "deblur_request_status_idx" ON "ai-image-generator-starter_deblur_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deblur_request_createdAt_idx" ON "ai-image-generator-starter_deblur_request" USING btree ("createdAt");