import {
  pgTable,
  text,
  integer,
  date,
  boolean,
  varchar,
  timestamp,
  numeric,
  serial
} from "drizzle-orm/pg-core";
import { ar } from "zod/v4/locales";

// --- User & Action Management ---

export const usersTable = pgTable("user_tb", {

  userId: integer("user_id")
    .generatedAlwaysAsIdentity({ startWith: 1 })
    .primaryKey(),
  userType: text("user_type").notNull(),
  username: text("username").notNull(),

  // The new fields that match your UI exactly!
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  department: text("department").notNull(),
  
  // Keep username for logging in, and keep our awesome status trick!
  status: text("user_status").default("active").notNull()

  
});

export const passwordsTable = pgTable("password_tb", {
  // Added PK to support the requested 9,000,000 starting value
  passwordId: integer("password_id")
    .generatedAlwaysAsIdentity({ startWith: 9000001 })
    .primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  password: text("password").notNull(),
  lastChangedAt: timestamp("last_changed_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// List of actions that can be logged in the system.
export const actionsTable = pgTable("action_tb", {
  actionId: serial("action_id").primaryKey(),
  actionDesc: text("action_desc").notNull(),
  tableAffected: text("table_affected").notNull(),
});

// Logs of actions performed by users.
export const logsTable = pgTable("log_tb", {
  logId: serial("log_id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  actionId: integer("action_id").references(() => actionsTable.actionId),
  targetId: integer("target_id").notNull(),
  logDate: timestamp("log_date").defaultNow(),
  columnName: varchar("column_name", { length: 50 }),
  prevValue: varchar("prev_value", { length: 255 }),
  newValue: varchar("new_value", { length: 255 }),
  remarks: varchar("remarks", { length: 255 }),
});

export const reportsTable = pgTable("report_tb", {
  reportId: integer("report_id")
    .generatedAlwaysAsIdentity({ startWith: 5000001 })
    .primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  reportType: text("report_type").notNull(),
  dateCreated: timestamp("date_created").defaultNow(),
  dateStart: timestamp("date_start"),
  dateEnd: timestamp("date_end"),
});

// --- Projects ---

export const projectsTable = pgTable("project_tb", {
  projectId: integer("project_id")
    .generatedAlwaysAsIdentity({ startWith: 4000001 })
    .primaryKey(),
  projectName: text("project_name").notNull(),
  archived: boolean("archived").default(false),
});

// --- Suppliers & Products ---

export const suppliersTable = pgTable("supplier_tb", {
  supplierId: integer("supplier_id")
    .generatedAlwaysAsIdentity({ startWith: 7000001 })
    .primaryKey(),
  supplierName: text("supplier_name").notNull(),
  supplierLandline: text("supplier_landline"),
  supplierEmail: text("supplier_email"),
  supplierMobile: text("supplier_mobile"),
  active: boolean("active").default(true),
});

// List of items in the inventory
export const itemsTable = pgTable("item_tb", {
  productId: integer("product_id")
    .generatedAlwaysAsIdentity({ startWith: 8000001 })
    .primaryKey(),
  productName: text("product_name").notNull(),
  productCategory1: text("product_category1"),
  productCategory2: text("product_category2"),
  productCategory3: text("product_category3"),
  productCategory4: text("product_category4"),
  productCategory5: text("product_category5"),
  productDesc: text("product_desc"),
  productQuantity: integer("product_quantity").default(0),
  reorderLevel: integer("reorder_level"),
  archived: boolean("archived").default(false),
});

// List of suppliers and the products they supply
export const supplierItemsTable = pgTable("supplier_item_tb", {
  supplierItemId: integer("supplier_item_id")
    .generatedAlwaysAsIdentity({ startWith: 6000001 })
    .primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliersTable.supplierId),
  productId: integer("product_id").references(() => itemsTable.productId),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated")
    .defaultNow()
    .$onUpdate(() => new Date()),
  archived: boolean("archived").default(false),
});

// --- Orders ---

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
  createdBy: integer("created_by").references(() => usersTable.userId),
  approvedBy: integer("approved_by").references(() => usersTable.userId),
});

export const orderProductsTable = pgTable("order_product_tb", {
  orderProductId: integer("order_product_id")
    .generatedAlwaysAsIdentity({ startWith: 2000001 })
    .primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.orderId),
  productId: integer("product_id").references(() => itemsTable.productId),
  orderProductQuantity: integer("order_product_quantity").notNull(),
});

// --- Notifications ---

export const notificationsTable = pgTable("notification_tb", {
  notifId: serial("notif_id").primaryKey(),
  description: text("description").notNull(),
});

export const notificationDepartmentsTable = pgTable("notification_department_tb", {
  id: serial("id").primaryKey(),
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  department: text("department").notNull(), // e.g., 'ADMIN', 'WAREHOUSE'
});

export const userNotificationsTable = pgTable("user_notification_tb", {
  userNotifId: integer("user_notif_id")
    .generatedAlwaysAsIdentity({ startWith: 1000001 })
    .primaryKey(),
  userId: integer("user_id").references(() => usersTable.userId),
  notifId: integer("notif_id").references(() => notificationsTable.notifId),
  isRead: boolean("is_read").default(false),
  createdAt: date("created_at").defaultNow(),
});