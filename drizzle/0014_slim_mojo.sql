ALTER TABLE "item_tb" ALTER COLUMN "product_quantity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "expected_delivery_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "actual_delivery_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "last_updated" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "last_updated" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "ordered_value" text;--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "received_value" text;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD COLUMN "additional_description" text NOT NULL;