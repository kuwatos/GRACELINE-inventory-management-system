// CRUD lives here
import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq, lte, ilike, or, and } from "drizzle-orm";
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

    await createUserNotificationService({ notifId: 1 }, tx); // Assuming notifId 1 is for new item notifications
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
  reorderLevel?: number;
}) {
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get current state for comparison
    const [existing] = await tx
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.productId, id))
      .limit(1);

    if (!existing) throw new Error("Item not found");

    const updates: Record<string, any> = {};

    // 2. Iterate and Log individual changes
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        let actionId: number;
        let remarks: string | null = null;

        // 3. Logic for specific Action IDs
        if (key === "productQuantity") {
          actionId = 10; // Edited an Item’s Quantity
        } else if (key === "reorderLevel") {
          actionId = 7; // Set the reorder level
        } else {
          actionId = 11; // Edited an Item (General)
        }

        // 4. Use the createLog helper with columnName
        await createLog({
          actionId: actionId,
          targetId: id,
          columnName: key, // DYNAMIC: e.g., "productName", "productCategory1", etc.
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
          remarks: remarks,
        }, tx);
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes" };

    // 5. Finalize update
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
    await tx.delete(itemsTable).where(eq(itemsTable.productId, id));

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