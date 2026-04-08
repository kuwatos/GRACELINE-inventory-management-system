// CRUD lives here
import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq, lte, ilike, or, and, isNotNull } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import {createUserNotificationService} from "../user_notifications/user_notifications.service";

// CREATE
export async function createItem(data: {
  productName: string;
  productCategory1: string;
  productCategory2?: string;
  productCategory3?: string;
  productCategory4?: string;
  productCategory5?: string;
  productDesc?: string;
  productQuantity?: number;
  reorderLevel?: number;
  measurement: string;
}) {
  return await db.transaction(async (tx) => {
    // 1. Insert Item
    const [newItem] = await tx.insert(itemsTable).values(data).returning();

    // 2. Log Creation (Action ID 8) for every populated field
    if (newItem) {
      for (const [key, val] of Object.entries(newItem)) {
        // We only log if the value actually exists (not null/undefined)
        if (val !== null && val !== undefined) {
          await createLog({
            actionId: 8,                    // Added a New Inventory Item
            targetId: newItem.productId,
            columnName: key,                // Dynamic: productName, productCategory1, etc.
            prevValue: null,                // It's a creation, so previous is always null
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }
    }

    await createUserNotificationService({ notifId: 1, targetId: newItem.productId }, tx); // Assuming notifId 1 is for new item notifications
    return newItem;
  });
}

// READ
export async function readItems() {
  return db.select().from(itemsTable);
}

// READ ALL LOW STOCK
export async function readLowStockItems() {
  return db
    .select()
    .from(itemsTable)
    .where(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
}

// SEARCH (No changes needed for Search)
export async function searchItems(filters: {
  keyword?: string;
  category?: string;
  lowStock?: boolean;
}) {
  const conditions = [];
  if (filters.keyword) {
    conditions.push(
      or(
        ilike(itemsTable.productName, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory1, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory2, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory3, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory4, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory5, `%${filters.keyword}%`),
      ),
    );
  }
  if (filters.category) {
    conditions.push(eq(itemsTable.productCategory1, filters.category));
  }
  if (filters.lowStock) {
    conditions.push(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
  }
  return db.select().from(itemsTable).where(and(...conditions));
}

// UPDATE
export async function updateItem(data: {
  id: number;
  productName?: string;
  productCategory1?: string;
  productCategory2?: string;
  productCategory3?: string;
  productCategory4?: string;
  productCategory5?: string;
  productDesc?: string;
  productQuantity?: number;
  newQuantity?: number; // 👈 UI might send this
  reorderLevel?: number;
  remarks?: string;      // 👈 Extract this for logging
  measurement?: string;
}) {
  const { id, remarks: globalRemarks, ...rest } = data;

  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.productId, id))
      .limit(1);

  if (!existing) throw new Error("Item not found");

  // 1. Prepare the final fields for comparison
  const incomingFields: Record<string, any> = { ...rest };
  

  const updates: Record<string, any> = {};

  // 3. Iterate and Log
  for (const [key, val] of Object.entries(incomingFields)) {
    // Only process fields that actually exist in your itemsTable schema
    const oldValue = (existing as any)[key];

    if (val !== undefined && String(val) !== String(oldValue)) {
      updates[key] = val;

      let actionId: number;

      if (key === "productQuantity") {
        actionId = 10;
        const reorderLevel = Number(existing.reorderLevel);
        if (!isNaN(val) && !isNaN(reorderLevel) && val <= reorderLevel) {
          await createUserNotificationService({ notifId: 2, targetId: id }, tx);
        }
      } else if (key === "reorderLevel") {
        actionId = 7;
      } else {
        actionId = 11;
      }

      await createLog({
        actionId,
        targetId: id,
        columnName: key,
        prevValue: oldValue?.toString() || null,
        newValue: val.toString(),
        remarks: globalRemarks || null, // 👈 Use the passed-in reason here!
      }, tx);
    }
  }

  if (Object.keys(updates).length === 0) return { message: "No changes" };

  // 4. Finalize update (Drizzle will only see valid columns now)
  const [updatedItem] = await tx
    .update(itemsTable)
    .set(updates)
    .where(eq(itemsTable.productId, id))
    .returning();

  return updatedItem;
  });
}

// DELETE
export async function deleteItem(id: number) {
  return await db.transaction(async (tx) => {
    const [item] = await tx 
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.productId, id))
      .limit(1);
      
    if (!item) throw new Error("Item not found");

    // Perform Delete
    await tx.update(itemsTable).set({ archived: true }).where(eq(itemsTable.productId, id)).returning();

    // Log Deletion (Action ID 9)
    await createLog({
      actionId: 9,
      targetId: id,
      columnName: "product_name",
      prevValue: item.productName,
      newValue: null,
    }, tx);

    return { success: true };
  });
}

export async function findCategories() {
  return await db
    .select({ 
      name: itemsTable.productCategory1 
    })
    .from(itemsTable)
    .where(isNotNull(itemsTable.productCategory1)) // 👈 Hide empty categories
    .groupBy(itemsTable.productCategory1);
}

export async function findMeasurement() {
  return await db
    .select({
      name: itemsTable.measurement
    })
    .from(itemsTable)
    .where(isNotNull(itemsTable.measurement))
    .groupBy(itemsTable.measurement);
}
