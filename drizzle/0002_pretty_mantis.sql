CREATE TABLE "password_tb" (
	"user_id" integer,
	"password" text NOT NULL,
	"last_changed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_tb" (
	"project_id" serial PRIMARY KEY NOT NULL,
	"project_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_item_tb" (
	"supplier_item_id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer,
	"product_id" integer,
	"unit_price" numeric(10, 2),
	"last_updated" date
);
--> statement-breakpoint
ALTER TABLE "inventory_tb" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "inventory_tb" CASCADE;--> statement-breakpoint
ALTER TABLE "items_tb" RENAME TO "item_tb";--> statement-breakpoint
ALTER TABLE "notifications_tb" RENAME TO "notification_tb";--> statement-breakpoint
ALTER TABLE "reports_tb" RENAME TO "report_tb";--> statement-breakpoint
ALTER TABLE "notifications_list_tb" RENAME TO "user_notification_tb";--> statement-breakpoint
ALTER TABLE "users_tb" RENAME TO "user_tb";--> statement-breakpoint
ALTER TABLE "user_notification_tb" RENAME COLUMN "notif_list_id" TO "user_notif_id";--> statement-breakpoint
ALTER TABLE "supplier_tb" RENAME COLUMN "supplier_contact" TO "supplier_landline";--> statement-breakpoint
ALTER TABLE "item_tb" DROP CONSTRAINT "items_tb_product_id_inventory_tb_product_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tb" DROP CONSTRAINT "items_tb_supplier_id_supplier_tb_supplier_id_fk";
--> statement-breakpoint
ALTER TABLE "log_tb" DROP CONSTRAINT "log_tb_user_id_users_tb_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP CONSTRAINT "notifications_list_tb_notif_id_notifications_tb_notif_id_fk";
--> statement-breakpoint
ALTER TABLE "order_product_tb" DROP CONSTRAINT "order_product_tb_product_id_items_tb_product_id_fk";
--> statement-breakpoint
ALTER TABLE "report_tb" DROP CONSTRAINT "reports_tb_user_id_users_tb_user_id_fk";
--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "log_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "item_tb" ADD COLUMN "product_category4" text;--> statement-breakpoint
ALTER TABLE "item_tb" ADD COLUMN "product_category5" text;--> statement-breakpoint
ALTER TABLE "item_tb" ADD COLUMN "product_quantity" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "log_tb" ADD COLUMN "target_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD COLUMN "is_read" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD COLUMN "created_at" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "expected_delivery_date" date;--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "actual_delivery_date" date;--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "order_tb" ADD COLUMN "approved_by" integer;--> statement-breakpoint
ALTER TABLE "supplier_tb" ADD COLUMN "supplier_email" text;--> statement-breakpoint
ALTER TABLE "supplier_tb" ADD COLUMN "supplier_mobile" text;--> statement-breakpoint
ALTER TABLE "password_tb" ADD CONSTRAINT "password_tb_user_id_user_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ADD CONSTRAINT "supplier_item_tb_supplier_id_supplier_tb_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier_tb"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ADD CONSTRAINT "supplier_item_tb_product_id_item_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."item_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_user_id_user_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD CONSTRAINT "user_notification_tb_user_id_user_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD CONSTRAINT "user_notification_tb_notif_id_notification_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notification_tb"("notif_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD CONSTRAINT "order_product_tb_product_id_item_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."item_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_project_id_project_tb_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project_tb"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_created_by_user_tb_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_approved_by_user_tb_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_tb" ADD CONSTRAINT "report_tb_user_id_user_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tb" DROP COLUMN "supplier_id";--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP COLUMN "resolved_ad";--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP COLUMN "resolved_pur";--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP COLUMN "resolved_fin";--> statement-breakpoint
ALTER TABLE "user_notification_tb" DROP COLUMN "resolved_ware";--> statement-breakpoint
ALTER TABLE "order_tb" DROP COLUMN "delivery_date";--> statement-breakpoint
ALTER TABLE "user_tb" DROP COLUMN "password";