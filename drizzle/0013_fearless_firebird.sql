ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET DEFAULT timezone('Asia/Manila', now());--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "supplier_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_created" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_created" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_created" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_start" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_start" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_end" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "date_end" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "unit_price" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "last_updated" SET DEFAULT timezone('Asia/Manila', now());--> statement-breakpoint
ALTER TABLE "supplier_tb" ALTER COLUMN "supplier_mobile" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "created_at" SET DEFAULT timezone('Asia/Manila', now());--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "item_tb" ADD COLUMN "measurement" text NOT NULL;--> statement-breakpoint
ALTER TABLE "log_tb" ADD COLUMN "project" integer;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD COLUMN "expected_order_product_quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD COLUMN "delivered_order_product_quantity" integer;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_project_project_tb_project_id_fk" FOREIGN KEY ("project") REFERENCES "public"."project_tb"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_order_product_idx" ON "order_product_tb" USING btree ("order_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_supplier_product_idx" ON "supplier_item_tb" USING btree ("supplier_id","product_id");--> statement-breakpoint
ALTER TABLE "order_product_tb" DROP COLUMN "order_product_quantity";--> statement-breakpoint
ALTER TABLE "project_tb" ADD CONSTRAINT "project_tb_project_name_unique" UNIQUE("project_name");--> statement-breakpoint
ALTER TABLE "supplier_tb" ADD CONSTRAINT "supplier_tb_supplier_name_unique" UNIQUE("supplier_name");