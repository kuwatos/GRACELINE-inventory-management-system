//Sample only, to be replaced with actual Graceline schema. This was only grabbed sa Drizzle docs

import {
  pgTable,
  serial,
  text,
  integer,
  date,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

// --- User & Action Management ---

export const usersTable = pgTable("users_tb", {
  userId: serial("user_id").primaryKey(),
  userType: text("user_type").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const actionsTable = pgTable("action_tb", {
  actionId: serial("action_id").primaryKey(),
  actionDesc: text("action_desc").notNull(),
  tableAffected: text("table_affected").notNull(),
});

export const logsTable = pgTable("log_tb", {
  logId: serial("log_id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  actionId: integer("action_id").references(() => actionsTable.actionId),
  logDate: date("log_date").defaultNow(),
  prevValue: varchar("prev_value", { length: 255 }),
  newValue: varchar("new_value", { length: 255 }),
  remarks: varchar("remarks", { length: 255 }),
});

// --- Suppliers & Products ---

export const suppliersTable = pgTable("supplier_tb", {
  supplierId: serial("supplier_id").primaryKey(),
  supplierName: text("supplier_name").notNull(),
  supplierContact: text("supplier_contact").notNull(),
});

export const inventoryTable = pgTable("inventory_tb", {
  productId: integer("product_id").primaryKey(), // 1:1 or managed via Items
  productQuantity: integer("product_quantity").notNull().default(0),
});

export const itemsTable = pgTable("items_tb", {
  productId: serial("product_id")
    .primaryKey()
    .references(() => inventoryTable.productId),
  productName: text("product_name").notNull(),
  productCategory1: text("product_category1"),
  productCategory2: text("product_category2"),
  productCategory3: text("product_category3"),
  supplierId: integer("supplier_id").references(
    () => suppliersTable.supplierId,
  ),
  productDesc: text("product_desc"),
  reorderLevel: integer("reorder_level"),
  archived: boolean("archived").default(false),
});

// --- Orders ---

export const ordersTable = pgTable("order_tb", {
  orderId: serial("order_id").primaryKey(),
  orderStatus: text("order_status").notNull(),
  orderDate: date("order_date").notNull(),
  supplierId: integer("supplier_id").references(
    () => suppliersTable.supplierId,
  ),
  deliveryDate: date("delivery_date"),
});

export const orderProductsTable = pgTable("order_product_tb", {
  orderProductId: serial("order_product_id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.orderId),
  productId: integer("product_id").references(() => itemsTable.productId),
  orderProductQuantity: integer("order_product_quantity").notNull(),
});

// --- Notifications ---

export const notificationsTable = pgTable("notifications_tb", {
  notifId: serial("notif_id").primaryKey(),
  department: text("department").notNull(),
  description: text("description").notNull(),
});

export const notificationsListTable = pgTable("notifications_list_tb", {
  notifListId: serial("notif_list_id").primaryKey(),
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  date: date("date").notNull(),
  resolvedAd: boolean("resolved_ad").default(false),
  resolvedPur: boolean("resolved_pur").default(false),
  resolvedFin: boolean("resolved_fin").default(false),
  resolvedWare: boolean("resolved_ware").default(false),
});

// --- Reporting ---

export const reportsTable = pgTable("reports_tb", {
  reportId: serial("report_id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  reportType: text("report_type").notNull(),
  dateCreated: date("date_created").defaultNow(),
  dateStart: date("date_start"),
  dateEnd: date("date_end"),
});
