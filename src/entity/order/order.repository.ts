// CRUD lives here
import { db } from "../../index";
import { ordersTable } from "../../db/schema";
import { eq, count, and, or, ilike, isNotNull } from "drizzle-orm";
import { createLog } from "../log/log.repository";

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

//SEARCH
export async function searchOrders(filters: {
  keyword?: string;
  category?: string;
  approved?: boolean;
}) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
  if (filters.keyword) {
    conditions.push(
      or(
        ilike(ordersTable.orderId, `%${filters.keyword}%`),
        ilike(ordersTable.projectId, `%${filters.keyword}%`),
        ilike(ordersTable.supplierId, `%${filters.keyword}%`),
      ),
    );
  }

  // Add condition to include all low stock items
  if (filters.category) {
    conditions.push(eq(ordersTable.orderStatus, filters.category));
  }

  // Add condition to include all low stock items
  if (filters.approved) {
    conditions.push(isNotNull(ordersTable.approvedBy));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(ordersTable)
    .where(and(...conditions));
}

//UPDATE
export async function updateOrder(data: {
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
  const [updatedOrder] = await db
    .update(ordersTable)
    .set({ orderStatus: data.orderStatus })
    .where(eq(ordersTable.orderId, data.id))
    .returning();

  if (updatedOrder && data.orderStatus === "Delivered") { //TODO: Change status if needed
    await createLog({
      actionId: 19,
      targetId: data.id,
      remarks: "Received an Order",
    });   
  }

  return updatedOrder;
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
