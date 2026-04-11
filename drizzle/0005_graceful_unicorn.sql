ALTER TABLE "log_tb" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "created_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_id" SET DATA TYPE text;