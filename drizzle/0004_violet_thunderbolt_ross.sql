CREATE TABLE "notification_department_tb" (
	"id" serial PRIMARY KEY NOT NULL,
	"notif_id" integer,
	"department" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_tb" ALTER COLUMN "product_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "item_tb" ALTER COLUMN "product_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "item_tb_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 8000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "order_product_tb" ALTER COLUMN "order_product_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_product_tb" ALTER COLUMN "order_product_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "order_product_tb_order_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_tb" ALTER COLUMN "order_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "order_tb_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "project_tb" ALTER COLUMN "project_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project_tb" ALTER COLUMN "project_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "project_tb_project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 4000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "report_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "report_tb" ALTER COLUMN "report_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "report_tb_report_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 5000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "supplier_item_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ALTER COLUMN "supplier_item_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "supplier_item_tb_supplier_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 6000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "supplier_tb" ALTER COLUMN "supplier_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "supplier_tb" ALTER COLUMN "supplier_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "supplier_tb_supplier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 7000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_notif_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ALTER COLUMN "user_notif_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "user_notification_tb_user_notif_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "user_tb" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user_tb" ALTER COLUMN "user_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "user_tb_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "log_tb" ADD COLUMN "column_name" varchar(50);--> statement-breakpoint
ALTER TABLE "password_tb" ADD COLUMN "password_id" integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "password_tb_password_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 9000000 CACHE 1);--> statement-breakpoint
ALTER TABLE "notification_department_tb" ADD CONSTRAINT "notification_department_tb_notif_id_notification_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notification_tb"("notif_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_tb" DROP COLUMN "department";