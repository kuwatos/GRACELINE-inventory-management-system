CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp (6) with time zone,
	"refresh_token_expires_at" timestamp (6) with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_tb" (
	"action_id" serial PRIMARY KEY NOT NULL,
	"action_desc" text NOT NULL,
	"table_affected" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_tb" (
	"product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "item_tb_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 8000001 CACHE 1),
	"product_name" text NOT NULL,
	"product_category1" text NOT NULL,
	"product_category2" text,
	"product_category3" text,
	"product_category4" text,
	"product_category5" text,
	"product_desc" text,
	"product_quantity" integer DEFAULT 0,
	"reorder_level" integer,
	"archived" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "log_tb" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action_id" integer,
	"target_id" text NOT NULL,
	"log_date" timestamp DEFAULT now(),
	"column_name" varchar(50),
	"prev_value" varchar(255),
	"new_value" varchar(255),
	"remarks" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "notification_department_tb" (
	"id" serial PRIMARY KEY NOT NULL,
	"notif_id" integer,
	"department" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_tb" (
	"notif_id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_product_tb" (
	"order_product_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_product_tb_order_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 2000001 CACHE 1),
	"order_id" integer,
	"product_id" integer,
	"order_product_quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_tb" (
	"order_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_tb_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 3000001 CACHE 1),
	"order_status" text NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"supplier_id" integer,
	"expected_delivery_date" timestamp,
	"actual_delivery_date" timestamp,
	"project_id" integer,
	"created_by" text NOT NULL,
	"approved_by" text
);
--> statement-breakpoint
CREATE TABLE "project_tb" (
	"project_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_tb_project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 4000001 CACHE 1),
	"project_name" text NOT NULL,
	"archived" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "report_tb" (
	"report_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "report_tb_report_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 5000001 CACHE 1),
	"user_id" text,
	"report_type" text NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_start" timestamp,
	"date_end" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "supplier_item_tb" (
	"supplier_item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supplier_item_tb_supplier_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 6000001 CACHE 1),
	"supplier_id" integer,
	"product_id" integer,
	"unit_price" numeric(10, 2),
	"last_updated" timestamp DEFAULT now(),
	"archived" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "supplier_tb" (
	"supplier_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supplier_tb_supplier_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 7000001 CACHE 1),
	"supplier_name" text NOT NULL,
	"supplier_landline" text,
	"supplier_email" text,
	"supplier_mobile" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_notification_tb" (
	"user_notif_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_notification_tb_user_notif_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000001 CACHE 1),
	"user_id" text,
	"target_id" integer,
	"notif_id" integer,
	"is_read" boolean DEFAULT false,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	"username" varchar(255),
	"display_username" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp (6) with time zone,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"department" text NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp (6) with time zone NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_tb" ADD CONSTRAINT "log_tb_action_id_action_tb_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action_tb"("action_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_department_tb" ADD CONSTRAINT "notification_department_tb_notif_id_notification_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notification_tb"("notif_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD CONSTRAINT "order_product_tb_order_id_order_tb_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tb"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product_tb" ADD CONSTRAINT "order_product_tb_product_id_item_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."item_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_supplier_id_supplier_tb_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier_tb"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_project_id_project_tb_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project_tb"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tb" ADD CONSTRAINT "order_tb_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_tb" ADD CONSTRAINT "report_tb_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ADD CONSTRAINT "supplier_item_tb_supplier_id_supplier_tb_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier_tb"("supplier_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_item_tb" ADD CONSTRAINT "supplier_item_tb_product_id_item_tb_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."item_tb"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD CONSTRAINT "user_notification_tb_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_tb" ADD CONSTRAINT "user_notification_tb_notif_id_notification_tb_notif_id_fk" FOREIGN KEY ("notif_id") REFERENCES "public"."notification_tb"("notif_id") ON DELETE no action ON UPDATE no action;