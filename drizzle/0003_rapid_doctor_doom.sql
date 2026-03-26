ALTER TABLE "order_tb" ALTER COLUMN "order_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "expected_delivery_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "actual_delivery_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "password_tb" ALTER COLUMN "last_changed_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_created" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_created" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_start" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_end" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "last_updated" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "last_updated" SET DEFAULT now();