// CRUD lives here
import { db } from "../../index";
import { ordersTable } from "../../db/schema";
import { eq, count, and, or, ilike, isNotNull,sql } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { createUserNotificationService } from "../user_notifications/user_notifications.service";
import { validateSessionUser } from "../user/user.repository";
import { PgTransaction } from "drizzle-orm/pg-core";
import Big from "big.js";

// Type definition for the transaction context
type Transaction = PgTransaction<any, any, any>;

// CREATE
export async function createOrder(data: {
  orderStatus: string;
  supplierId: number;
  expectedDeliveryDate: Date;
  actualDeliveryDate: null;
  projectId: number | null;
  createdBy: string;
  approvedBy: null;
  orderedValue: string
}) {
  return await db.transaction(async (tx) => {
    // 1. Insert the new order
    const [newOrder] = await tx.insert(ordersTable).values(data).returning();

    // 2. Log every populated field (Action ID 15)
    if (newOrder) {
      for (const [key, val] of Object.entries(newOrder)) {
        if (val !== null && val !== undefined) {
          await createLog({
            userId: data.createdBy,
            actionId: 15,                  // Created a purchase order
            targetId: newOrder.orderId,
            columnName: key,
            prevValue: null,
            newValue: val instanceof Date ? val.toISOString() : val.toString(),
            remarks: null,
          }, tx);
        }
      }
    }

    return newOrder;
  });
}

// READ
export async function readOrder() {

  return db.select().from(ordersTable);
}

// COUNT PENDING ORDERS
//TODO: Change
export async function readPendingOrders() {
  return db
    .select({ count: count() })
    .from(ordersTable)
    .where(or(eq(ordersTable.orderStatus, "Awaiting payment"), 
              eq(ordersTable.orderStatus, "Awaiting delivery"),
            eq(ordersTable.orderStatus, "Incomplete delivery")));
}

// COUNT DELIVERED ORDERS
export async function readDeliveredOrders() {
  return db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.orderStatus, "Delivered"));
}

// SEARCH
export async function searchOrders(filters: {
  keyword?: string;
  category?: string;
  approved?: boolean;
}) {
  const conditions = [];

  if (filters.keyword) {
    // Note: orderId, projectId, and supplierId are usually integers. 
    // ilike requires casting if keyword is a string, 
    // but here we keep your original logic for keyword search.
    conditions.push(
      or(
        ilike(ordersTable.orderStatus, `%${filters.keyword}%`),
        // Add other text-based fields if necessary
      ),
    );
  }

  if (filters.category) {
    conditions.push(eq(ordersTable.orderStatus, filters.category));
  }

  if (filters.approved) {
    conditions.push(isNotNull(ordersTable.approvedBy));
  }

  return db
    .select()
    .from(ordersTable)
    .where(and(...conditions));
}

// UPDATE
export async function updateOrder(data: {
  sessionUserId: string;
  id: number;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  projectId?: number;
  orderedValue: string;
}) {
  const { id, sessionUserId, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Check if order exists
    const [existing] = await tx
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderId, id))
      .limit(1);

    if (!existing) throw new Error("Order not found");

    const updates: Record<string, any> = {};

    // 2. Dynamic Diffing Loop
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];
      if (val === undefined) continue;

      // Standardize comparison (especially for Dates)
      const isDifferent = val instanceof Date && oldValue instanceof Date 
        ? val.getTime() !== oldValue.getTime() 
        : String(val) !== String(oldValue);

      if (val !== undefined && isDifferent) {
        updates[key] = val;
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes detected" };

    // 2. Finalize update
    const [updatedOrder] = await tx
      .update(ordersTable)
      .set(updates)
      .where(eq(ordersTable.orderId, id))
      .returning();

    return updatedOrder;
  });
}

// CHANGE STATUS
export async function changeOrderStatus(data: {
  id: number;
  orderStatus: string;
  receivedValue?: string
}, prevTx? : Transaction) {

  const client = prevTx ?? db;

  return await client.transaction(async (tx) => {
    const user = await validateSessionUser()

    const [existing] = await tx
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderId, data.id))
      .limit(1);

    if (!existing) throw new Error("Order not found");

    const [updatedOrder] = await tx
      .update(ordersTable)
      .set({ orderStatus: data.orderStatus })
      .where(eq(ordersTable.orderId, data.id))
      .returning();

    if (updatedOrder) {

      // Special Action for Received orders
      if (data.orderStatus === "Complete" || data.orderStatus === "Incomplete") {
        const newReceivedValue = new Big(existing.receivedValue ?? "0")
          .plus(new Big(data.receivedValue ?? "0"))
          .toFixed(2);

        const [orderRecieved] = await tx
          .update(ordersTable)
          .set({ 
            receivedValue: newReceivedValue,
            actualDeliveryDate:  sql`now()`, // date when order was received
          })
          .where(eq(ordersTable.orderId, data.id))
          .returning();
        
        if(orderRecieved) {
          await createLog({
            userId: user.id,
            actionId: 19,                  // Received an order
            targetId: data.id,
            columnName: "orderStatus",
            prevValue: existing.orderStatus,
            newValue: data.orderStatus
          }, tx);

          await createLog({
            userId: user.id,
            actionId: 19,                  // Received an order
            targetId: data.id,
            columnName: "receivedValue",
            prevValue: existing.receivedValue,
            newValue: newReceivedValue
          }, tx);
        }
        await createUserNotificationService({ notifId: 6, targetId: data.id }, tx);
      }

      else if(data.orderStatus === "Awaiting Delivery") {
        const [orderPlaced] = await tx
          .update(ordersTable)
          .set({ 
            orderDate:  sql`now()`, // date when order was placed
          })
          .where(eq(ordersTable.orderId, data.id))
          .returning();
        
        if(orderPlaced) {
          await createLog({
            userId: user.id,
            actionId: 16,                  // Placed an order
            targetId: data.id,
            columnName: "orderStatus",
            prevValue: existing.orderStatus,
            newValue: data.orderStatus
          }, tx);
          await createUserNotificationService({ notifId: 8, targetId: data.id }, tx);
        }
      }
    }

    return updatedOrder;
  });
}

// APPROVE ORDER
export async function approveOrder(data: { id: number; }) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser()

    const [existing] = await tx
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderId, data.id))
      .limit(1);

    if (!existing) throw new Error("Order not found");

    const [updatedOrder] = await tx
      .update(ordersTable)
      .set({ 
        approvedBy: user.id,
        orderStatus: "Official"
      })
      .where(eq(ordersTable.orderId, data.id))
      .returning();

    if (updatedOrder) {
      await createLog({
        userId: user.id,
        actionId: 18,                    // Approved a purchase order
        targetId: data.id,
        columnName: "approvedBy",
        prevValue: existing.approvedBy?.toString() ?? null,
        newValue: user.id.toString(),
      }, tx);
      await createUserNotificationService({ notifId: 5, targetId: data.id }, tx);
    }
    return updatedOrder;
  });
}

export async function notifyArrivingOrders() {
  return await db.transaction(async (tx) => {
    // 1. Get Today's Date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // 2. Find orders where expected delivery is today
    const orders = await tx
      .select()
      .from(ordersTable)
      .where(sql`DATE(${ordersTable.expectedDeliveryDate}) = ${today}`);

    // 3. Trigger notification for each order
    for (const order of orders) {
      await createUserNotificationService({ 
        notifId: 4, // "Order Should Arrive Today"
        targetId: order.orderId
      }, tx);
    }
    
    return { count: orders.length };
  });
}

export async function deleteOrder(orderId: number) {
  return await db.transaction(async (tx) => {


      const user = await validateSessionUser()
      const [order] = await tx 
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.orderId, orderId))
        .limit(1);
        
      if (!order) throw new Error("Order not found");
  
      // Perform Delete
      await db
          .delete(ordersTable)
          .where(eq(ordersTable.orderId, orderId))
          .returning();
      
      // Log Deletion (Action ID 17)
      await createLog({
        userId: user.id,
        actionId: 17,
        targetId: orderId,
        columnName: "order_id",
        prevValue: order.orderId.toString(),
        newValue: null,
      }, tx);
  
      return { success: true };
    });
  
}