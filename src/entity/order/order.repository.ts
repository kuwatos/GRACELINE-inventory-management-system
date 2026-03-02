// CRUD lives here
import { db } from "../../index";
import { ordersTable } from "../../db/schema";
import { eq, count } from "drizzle-orm";

//CREATE
export async function createOrder(data: {
  orderStatus: string;
  orderDate: Date;
  supplierId: number;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  projectId: number;
  createdBy: number;
  approvedBy?: number;
}) {
  return db.insert(ordersTable).values(data).returning();
}

//READ
export async function readOrder() {
  return db.select().from(ordersTable);
}

//TODO: CHANGE STATUS IF THE TERM IS CHANGED
//COUNT PENDING ORDERS
export async function readPendingOrders() {
  return db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.orderStatus, "Pending"));
}

//TODO: CHANGE STATUS IF THE TERM IS CHANGED
//COUNT PENDING ORDERS
export async function readReceivedOrders() {
  return db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.orderStatus, "Received"));
}

//UPDATE
export async function updateItem(data: {
  id: number;
  orderDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  projectId?: number;
  createdBy?: number;
}) {
  const { id, ...fields } = data;

  return db
    .update(ordersTable)
    .set(fields)
    .where(eq(ordersTable.orderId, data.id))
    .returning();
}

//CHANGE STATUS
export async function changeOrderStatus(data: {
  id: number;
  orderStatus: string;
}) {
  return db
    .update(ordersTable)
    .set({ orderStatus: data.orderStatus })
    .where(eq(ordersTable.orderId, data.id))
    .returning();
}

//APPROVE ORDER
export async function approveOrder(data: { id: number; approvedBy: number }) {
  return db
    .update(ordersTable)
    .set({ approvedBy: data.approvedBy })
    .where(eq(ordersTable.orderId, data.id))
    .returning();
}

//DELETE
// Deleting is not allowed, if a user wants to delete an order, just let it float unapproved
