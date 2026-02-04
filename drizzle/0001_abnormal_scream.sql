CREATE TABLE "action_tb" (
	"action_id" serial PRIMARY KEY NOT NULL,
	"action_desc" text NOT NULL,
	"table_affected" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_tb" (
	"product_id" integer PRIMARY KEY NOT NULL,
	"product_quantity" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items_tb" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"product_category1" text,
	"product_category2" text,
	"product_category3" text,
	"supplier_id" integer,
	"product_desc" text,
	"reorder_level" integer,
	"archived" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "log_tb" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action_id" integer,
	"log_date" date DEFAULT now(),
	"prev_value" varchar(255),
	"new_value" varchar(255),
	"remarks" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "notifications_list_tb" (
	"notif_list_id" serial PRIMARY KEY NOT NULL,
	"notif_id" integer,
	"date" date NOT NULL,
	"resolved_ad" boolean DEFAULT false,
	"resolved_pur" boolean DEFAULT false,
	"resolved_fin" boolean DEFAULT false,
	"resolved_ware" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "notifications_tb" (
	"notif_id" serial PRIMARY KEY NOT NULL,
	"department" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_product_tb" (
	"order_product_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"order_product_quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_tb" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"order_status" text NOT NULL,
	"order_date" date NOT NULL,
	"supplier_id" integer,
	"delivery_date" date
);
--> statement-breakpoint
CREATE TABLE "reports_tb" (
	"report_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"report_type" text NOT NULL,
	"date_created" date DEFAULT now(),
	"date_start" date,
	"date_end" date
);
--> statement-breakpoint
CREATE TABLE "supplier_tb" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"supplier_name" text NOT NULL,
	"supplier_contact" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_tb" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"user_type" text NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "action" CASCADE;--> statement-breakpoint
DROP TABLE "inventory" CASCADE;--> statement-breakpoint
DROP TABLE "items" CASCADE;--> statement-breakpoint
DROP TABLE "log" CASCADE;--> statement-breakpoint
DROP TABLE "notifications" CASCADE;--> statement-breakpoint
DROP TABLE "notifications_list" CASCADE;--> statement-breakpoint
DROP TABLE "order_product" CASCADE;--> statement-breakpoint
DROP TABLE "order" CASCADE;--> statement-breakpoint
DROP TABLE "reports" CASCADE;--> statement-breakpoint
DROP TABLE "supplier" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
ALTER TABLE "items_tb" ADD CONSTRAINT "items_tb_product_id_inventory_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."inventory_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_tb" ADD CONSTRAINT "items_tb_supplier_id_supplier_tb_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier_tb"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_user_id_users_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_action_id_action_tb_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action_tb"("action_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_list_tb" ADD CONSTRAINT "notifications_list_tb_notif_id_notifications_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notifications_tb"("notif_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD CONSTRAINT "order_product_tb_order_id_order_tb_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tb"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD CONSTRAINT "order_product_tb_product_id_items_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."items_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_supplier_id_supplier_tb_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier_tb"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports_tb" ADD CONSTRAINT "reports_tb_user_id_users_tb_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE no action ON UPDATE no action;