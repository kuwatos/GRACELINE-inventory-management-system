CREATE TABLE "notification_department_tb" (
	"id" serial PRIMARY KEY NOT NULL,
	"notif_id" integer,
	"department" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_tb" ALTER COLUMN "product_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "item_tb" ALTER COLUMN "product_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "item_tb_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 8000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "log_tb" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_product_tb" ALTER COLUMN "order_product_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_product_tb" ALTER COLUMN "order_product_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "order_product_tb_order_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "order_tb_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "created_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "approved_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project_tb" ALTER COLUMN "project_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project_tb" ALTER COLUMN "project_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "project_tb_project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 4000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "report_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "report_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "report_tb_report_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 5000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "supplier_item_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "supplier_item_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "supplier_item_tb_supplier_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 6000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "supplier_tb" ALTER COLUMN "supplier_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "supplier_tb" ALTER COLUMN "supplier_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "supplier_tb_supplier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 7000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_notif_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_notif_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "user_notification_tb_user_notif_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000001 CACHE 1);--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "log_tb" ADD COLUMN "column_name" varchar(50);--> statement-breakpoint
ALTER TABLE "project_tb" ADD COLUMN "archived" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ADD COLUMN "archived" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "supplier_tb" ADD COLUMN "active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "notification_department_tb" ADD CONSTRAINT "notification_department_tb_notif_id_notification_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notification_tb"("notif_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_tb" DROP COLUMN "department";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "user_status";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_display_username_unique" UNIQUE("display_username");