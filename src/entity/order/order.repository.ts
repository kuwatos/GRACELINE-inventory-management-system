// CRUD lives here
import { db } from "../../index";
import { ordersTable } from "../../db/schema";
import { eq, count, and, or, ilike, isNotNull } from "drizzle-orm";
import { createLog } from "../log/log.repository";

// CREATE
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
  return await db.transaction(async (tx) => {
    // 1. Insert the new order
    const [newOrder] = await tx.insert(ordersTable).values(data).returning();

    // 2. Log every populated field (Action ID 15)
    if (newOrder) {
      for (const [key, val] of Object.entries(newOrder)) {
        if (val !== null && val !== undefined) {
          await createLog({
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
  id: number;
  orderDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  projectId?: number;
  createdBy?: number;
}) {
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get existing state
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

      // Standardize comparison (especially for Dates)
      const isDifferent = val instanceof Date && oldValue instanceof Date 
        ? val.getTime() !== oldValue.getTime() 
        : String(val) !== String(oldValue);

      if (val !== undefined && isDifferent) {
        updates[key] = val;

        await createLog({
          actionId: 16,                  // Edited a purchase order
          targetId: id,
          columnName: key,
          prevValue: oldValue instanceof Date ? oldValue.toISOString() : (oldValue?.toString() ?? null),
          newValue: val instanceof Date ? val.toISOString() : val.toString(),
          remarks: null,
        }, tx);
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes detected" };

    // 3. Finalize update
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
}) {
  return await db.transaction(async (tx) => {
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
      // General status change log
      await createLog({
        actionId: 16, // Edited (specifically the status)
        targetId: data.id,
        columnName: "orderStatus",
        prevValue: existing.orderStatus,
        newValue: data.orderStatus,
        remarks: null
      }, tx);

      // Special Log for Received orders
      if (data.orderStatus === "Delivered" || data.orderStatus === "Received") {
        await createLog({
          actionId: 19,                  // Received an order
          targetId: data.id,
          columnName: "orderStatus",
          prevValue: existing.orderStatus,
          newValue: data.orderStatus
        }, tx);
      }
    }

    return updatedOrder;
  });
}

// APPROVE ORDER
export async function approveOrder(data: { id: number; approvedBy: number }) {
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.orderId, data.id))
      .limit(1);

    if (!existing) throw new Error("Order not found");

    const [updatedOrder] = await tx
      .update(ordersTable)
      .set({ approvedBy: data.approvedBy })
      .where(eq(ordersTable.orderId, data.id))
      .returning();

    if (updatedOrder) {
      await createLog({
        actionId: 18,                    // Approved a purchase order
        targetId: data.id,
        columnName: "approvedBy",
        prevValue: existing.approvedBy?.toString() ?? null,
        newValue: data.approvedBy.toString(),
      }, tx);
    }

    return updatedOrder;
  });
}