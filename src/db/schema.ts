import {
  pgTable,
  serial,
  text,
  integer,
  date,
  boolean,
  varchar,
  timestamp,
  numeric,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- BetterAuth required schema for auth and session (do not modify!) ---

  // --- BetterAuth core user table (id = user_id from original schema)
export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).notNull(),
  
  //for username login plug-in
  username: varchar("username", { length: 255 }).unique(),
	displayUsername: text("display_username"),


  // custom fields for our app
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  department: text("department").notNull(),
  active: boolean("active").default(true),
});

export const sessionsTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
	token: varchar("token", { length: 255 }).notNull().unique(),
	expiresAt: timestamp("expires_at", { precision: 6, withTimezone: true }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).notNull(),
});

export const accountsTable = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { precision: 6, withTimezone: true }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { precision: 6, withTimezone: true }),
	scope: text("scope"),
	idToken: text("id_token"),
	password: text("password"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).notNull(),
});


export const verificationTable = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", { precision: 6, withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true }).notNull(),
});


//List of actions that can be logged in the system. Purpose niya lang is to be a list ng ilalagay sa logs tas nasa logs na yung
//may value and timestamp kung kelan ginawa yung action.
export const actionsTable = pgTable("action_tb", {
  actionId: serial("action_id").primaryKey(),
  actionDesc: text("action_desc").notNull(),
  tableAffected: text("table_affected").notNull(),
});

//Logs of actions performed by users. May prevValue at newValue para makita yung changes na ginawa sa isang record, and remarks for any additional info.
export const logsTable = pgTable("log_tb", {
  logId: serial("log_id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  actionId: integer("action_id").references(() => actionsTable.actionId),
  targetId: integer("target_id").notNull(),
  logDate: timestamp("log_date", { withTimezone: true })
    .notNull()
    .default(sql`timezone('Asia/Manila', now())`),
  columnName: varchar("column_name", { length: 50 }),
  prevValue: varchar("prev_value", { length: 255 }),
  newValue: varchar("new_value", { length: 255 }),
  remarks: varchar("remarks", { length: 255 }),
  projectId: integer("project").references(() => projectsTable.projectId),
});

export const reportsTable = pgTable("report_tb", {
  reportId: integer("report_id")
    .generatedAlwaysAsIdentity({ startWith: 5000001 })
    .primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  reportType: text("report_type").notNull(),
  dateCreated: timestamp("date_created", { withTimezone: true })
    .defaultNow(),
  dateStart: timestamp("date_start", { withTimezone: true }),
  dateEnd: timestamp("date_end", { withTimezone: true })
});

// --- Projects ---

export const projectsTable = pgTable("project_tb", {
  projectId: integer("project_id")
    .generatedAlwaysAsIdentity({ startWith: 4000001 })
    .primaryKey(),
  projectName: text("project_name").notNull().unique(),
  archived: boolean("archived").default(false),
});

// --- Suppliers & Products ---

export const suppliersTable = pgTable("supplier_tb", {
  supplierId: integer("supplier_id")
    .generatedAlwaysAsIdentity({ startWith: 7000001 })
    .primaryKey(),
  supplierName: text("supplier_name").notNull().unique(),
  supplierLandline: text("supplier_landline"),
  supplierEmail: text("supplier_email"),
  supplierMobile: text("supplier_mobile"),
  active: boolean("active").default(true),
});


//List of items in the inventory, with their details and quantity on hand. Eto na yung naging bagong inventory
export const itemsTable = pgTable("item_tb", {
  productId: integer("product_id")
    .generatedAlwaysAsIdentity({ startWith: 8000001 })
    .primaryKey(),
  productName: text("product_name").notNull(),
  productCategory1: text("product_category1").notNull(),
  productCategory2: text("product_category2"),
  productCategory3: text("product_category3"),
  productCategory4: text("product_category4"),
  productCategory5: text("product_category5"),
  productDesc: text("product_desc"),
  measurement: text("measurement").notNull(),
  productQuantity: integer("product_quantity").default(0),
  reorderLevel: integer("reorder_level"),
  archived: boolean("archived").default(false),
});

//List of suppliers and the products they supply, with the unit price and last updated date for each supplier-product combination.
export const supplierItemsTable = pgTable("supplier_item_tb", {
  supplierItemId: integer("supplier_item_id")
    .generatedAlwaysAsIdentity({ startWith: 6000001 })
    .primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliersTable.supplierId),
  productId: integer("product_id").references(() => itemsTable.productId),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated")
    // 1. For the initial insert (replaces defaultNow)
  .default(sql`timezone('Asia/Manila', now())`)
  // 2. For every update (replaces new Date())
  .$onUpdate(() => sql`timezone('Asia/Manila', now())`),
  archived: boolean("archived").default(false),
}, (table) => {
  return {
    // This creates a constraint where the same supplier + product pair cannot repeat
    uniqueLink: uniqueIndex("unique_supplier_product_idx").on(table.supplierId, table.productId),
  };
});
// --- Orders ---

//List of orders
export const ordersTable = pgTable("order_tb", {
  orderId: integer("order_id")
    .generatedAlwaysAsIdentity({ startWith: 3000001 })
    .primaryKey(),
  orderStatus: text("order_status").notNull(),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  supplierId: integer("supplier_id").references(() => suppliersTable.supplierId),
  expectedDeliveryDate: timestamp("expected_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  projectId: integer("project_id").references(() => projectsTable.projectId),
  createdBy: text("created_by").references(() => usersTable.id),
  approvedBy: text("approved_by").references(() => usersTable.id),
});

//List of products in each order, with the quantity ordered for each produc
//Eto yung naglilink sa orders at items table, kasi one order pwede may multiple products, and one product pwede maorder sa multiple orders.
export const orderProductsTable = pgTable("order_product_tb", {
  orderProductId: integer("order_product_id")
    .generatedAlwaysAsIdentity({ startWith: 2000001 })
    .primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.orderId),
  productId: integer("product_id").references(() => itemsTable.productId),
  orderProductQuantity: integer("order_product_quantity").notNull(),
}, (table) => ({
  unqOrderProduct: uniqueIndex("unique_order_product_idx").on(table.orderId, table.productId),
}));

// --- Notifications ---

//List of notifications that can be sent to users, with the department responsible for the notification and a description of the notification.
//Same logic lang with the actions table na list lang sial pareho and cant really be updated
export const notificationsTable = pgTable("notification_tb", {
  notifId: serial("notif_id").primaryKey(),
  description: text("description").notNull(),
});

export const notificationDepartmentsTable = pgTable("notification_department_tb", {
  id: serial("id").primaryKey(),
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  department: text("department").notNull(), // e.g., 'ADMIN', 'WAREHOUSE'
});

//List of notifications sent to users, eto na yung lumalabas sa users
export const userNotificationsTable = pgTable("user_notification_tb", {
  userNotifId: integer("user_notif_id")
    .generatedAlwaysAsIdentity({ startWith: 1000001 })
    .primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  targetId: integer("target_id"), // e.g., supplierId, orderId, etc. depending on the notification
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  isRead: boolean("is_read").default(false),
  createdAt: date("created_at")// 1. For the initial insert (replaces defaultNow)
  .default(sql`timezone('Asia/Manila', now())`)
  // 2. For every update (replaces new Date())
  .$onUpdate(() => sql`timezone('Asia/Manila', now())`),
});

