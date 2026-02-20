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
} from "drizzle-orm/pg-core";

// --- User & Action Management ---

export const usersTable = pgTable("user_tb", {
  userId: serial("user_id").primaryKey(),
  userType: text("user_type").notNull(),
  username: text("username").notNull(),
});

export const passwordsTable = pgTable("password_tb", {
  userId: integer("user_id").references(() => usersTable.userId),
  password: text("password").notNull(),
  lastChangedAt: timestamp("last_changed_at"),
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

export const reportsTable = pgTable("report_tb", {
  reportId: serial("report_id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  reportType: text("report_type").notNull(),
  dateCreated: date("date_created").defaultNow(),
  dateStart: date("date_start"),
  dateEnd: date("date_end"),
});

// --- Projects ---

export const projectsTable = pgTable("project_tb", {
  projectId: serial("project_id").primaryKey(),
  projectName: text("project_name").notNull(),
});

// --- Suppliers & Products ---

export const suppliersTable = pgTable("supplier_tb", {
  supplierId: serial("supplier_id").primaryKey(),
  supplierName: text("supplier_name").notNull(),
  supplierLandline: text("supplier_landline"),
  supplierEmail: text("supplier_email"),
  supplierMobile: text("supplier_mobile"),
});

export const itemsTable = pgTable("item_tb", {
  productId: serial("product_id").primaryKey(),
  productName: text("product_name").notNull(),
  productCategory1: text("product_category1"),
  productCategory2: text("product_category2"),
  productCategory3: text("product_category3"),
  productDesc: text("product_desc"),
  productQuantity: integer("product_quantity").default(0),
  reorderLevel: integer("reorder_level"),
  archived: boolean("archived").default(false),
});

export const supplierItemsTable = pgTable("supplier_item_tb", {
  supplierItemId: serial("supplier_item_id").primaryKey(),
  supplierId: integer("supplier_id").references(
    () => suppliersTable.supplierId,
  ),
  productId: integer("product_id").references(() => itemsTable.productId),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  lastUpdated: date("last_updated"),
});

// --- Orders ---

export const ordersTable = pgTable("order_tb", {
  orderId: serial("order_id").primaryKey(),
  orderStatus: text("order_status").notNull(),
  orderDate: date("order_date").notNull(),
  supplierId: integer("supplier_id").references(
    () => suppliersTable.supplierId,
  ),
  expectedDeliveryDate: date("expected_delivery_date"),
  actualDeliveryDate: date("actual_delivery_date"),
  projectId: integer("project_id").references(() => projectsTable.projectId),
  createdBy: integer("created_by").references(() => usersTable.userId),
  approvedBy: integer("approved_by").references(() => usersTable.userId),
});

export const orderProductsTable = pgTable("order_product_tb", {
  orderProductId: serial("order_product_id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.orderId),
  productId: integer("product_id").references(() => itemsTable.productId),
  orderProductQuantity: integer("order_product_quantity").notNull(),
});

// --- Notifications ---

export const notificationsTable = pgTable("notification_tb", {
  notifId: serial("notif_id").primaryKey(),
  department: text("department").notNull(),
  description: text("description").notNull(),
});

export const userNotificationsTable = pgTable("user_notification_tb", {
  userNotifId: serial("user_notif_id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  isRead: boolean("is_read").default(false),
  createdAt: date("created_at").defaultNow(),
});
