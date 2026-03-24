// CRUD lives here
import { db } from "../../index";
import { itemsTable, logsTable } from "../../db/schema";
import { eq, lte, ilike, or, and } from "drizzle-orm";

//CREATE
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
  return db.insert(itemsTable).values(data).returning();
}

//READ
export async function readItems() {
  return db.select().from(itemsTable);
}

//READ ALL LOW STOCK
export async function readLowStockItems() {
  return db
    .select()
    .from(itemsTable)
    .where(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
}

//SEARCH
export async function searchItems(filters: {
  keyword?: string;
  category?: string;
  lowStock?: boolean;
}) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
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

  //  Add category filter if selected
  if (filters.category) {
    conditions.push(eq(itemsTable.productCategory1, filters.category));
  }

  // Add numeric filter (e.g., Low Stock)
  if (filters.lowStock) {
    conditions.push(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(itemsTable)
    .where(and(...conditions));
}

//UPDATE
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
    const logEntries = [];

    // 2. Iterate through incoming fields
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      // Only act if the value is provided and different from the DB
      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        let actionId: number;
        let remarks: string | undefined = undefined; // Default to no remarks

        // 3. Define Logic per Case
        if (key === "productQuantity") {
          actionId = 10; // Edited an Item’s Quantity
          remarks = `Changed by admin/purchasing`; //TODO: Pwede ichange
        } else if (key === "reorderLevel") {
          actionId = 7; // Set the reorder level for an Item
          // No remarks as per your request
        } else {
          actionId = 11; // Edited an Item (General)
          // No remarks as per your request
        }

        // 4. Push individual log entry
        logEntries.push({
          actionId: actionId,
          targetId: id,
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
          remarks: remarks, // Will be undefined/null for non-quantity items
        });
      }
    }

    // 5. Early exit if no changes
    if (Object.keys(updates).length === 0) return { message: "No changes" };

    // 6. Finalize DB operations
    await tx
      .update(itemsTable)
      .set(updates)
      .where(eq(itemsTable.productId, id));
    await tx.insert(logsTable).values(logEntries);
  });
}

//DELETE
export async function deleteItem(id: number) {
  return await db.transaction(async (tx) => {
    // Fetch item before deleting to log what was lost
    const [item] = await tx 
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.productId, id))
      .limit(1);
    if (!item) throw new Error("Item not found");

    // Perform Delete
    await tx.delete(itemsTable).where(eq(itemsTable.productId, id));

    // Log the deletion (Action ID 3)
    await tx.insert(logsTable).values({
      actionId: 9,
      targetId: id,
      prevValue: item.productName,
    });

    return { success: true };
  });
}
