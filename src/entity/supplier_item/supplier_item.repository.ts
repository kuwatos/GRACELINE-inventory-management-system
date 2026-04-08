// CRUD lives here
import { db } from "../../index";
import { supplierItemsTable } from "../../db/schema";
import { eq, and} from "drizzle-orm";
import { createUserNotificationService } from "../user_notifications/user_notifications.service";
import { createLog } from "../log/log.repository";

//CREATE
export async function createSupplierItem(data: {
  supplierId: number;
  productId: number;
  unitPrice: string;
}) {
  return await db.transaction(async (tx) => {
    // 1. Insert the new link record
    const [newLink] = await tx.insert(supplierItemsTable).values(data).returning();

    if (newLink) {
      // 2. Iterate through the record to generate logs for every field
      for (const [key, val] of Object.entries(newLink)) {
        // Skip null/undefined values to keep logs clean
        if (val !== null && val !== undefined) {
          await createLog({
            actionId: 21,                   // [BLANK] - Fill in for "Link Supplier Item"
            targetId: newLink.supplierItemId,
            columnName: key,
            prevValue: null,
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }

      // 3. Trigger the notification service
      await createUserNotificationService({ 
        notifId: 8,                        // [BLANK] - Fill in for "New Item Linked"
        targetId: newLink.supplierItemId 
      }, tx);
    }

    return newLink;
  });
}

//READ GROUPED BY SUPPLIER
export async function readSupplierItemBySupplier() {
  return db
    .select()
    .from(supplierItemsTable)
    .groupBy(supplierItemsTable.supplierId);
}

//READ GROUPED BY ITEM
export async function readSupplierItemByItem() {
  return db
    .select()
    .from(supplierItemsTable)
    .groupBy(supplierItemsTable.productId);
}

//FIND EXISTING LINK
export async function findSupplierItemLink(supplierId: number, productId: number) {
  return db
      .select()
      .from(supplierItemsTable)
      .where(
        and(
          eq(supplierItemsTable.supplierId, supplierId),
          eq(supplierItemsTable.productId, productId),
          eq(supplierItemsTable.archived, false) // Only block if the active link exists
        )
      )
      .limit(1);
}


//UPDATE
export async function updateSupplierItem(data: {
  id: number; // 👈 This is the supplierItemId
  supplierId?: number;
  unitPrice?: string;
}) {
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get the current link state
    const [existing] = await tx
      .select()
      .from(supplierItemsTable)
      .where(eq(supplierItemsTable.supplierItemId, id))
      .limit(1);

    if (!existing) throw new Error("Specific supplier link not found");

    const updates: Record<string, any> = {};

    // 2. Comparison and Logging
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        await createLog({
          actionId: 20, 
          targetId: id, // The ID of the specific supplier-item link
          columnName: key,
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
        }, tx);
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes" };

    // 3. Update the specific link
    const [updated] = await tx
      .update(supplierItemsTable)
      .set(updates)
      .where(eq(supplierItemsTable.supplierItemId, id))
      .returning();

    // 4. Notify about the specific product's price change
    if (existing.productId !== null) {
      await createUserNotificationService({ notifId: 8, targetId: existing.productId }, tx);
    }

    return updated;
  });
}

//DELETE
export async function deleteSupplierItem(id: number) {
  await db
    .update(supplierItemsTable)
    .set({ archived: true })
    .where(eq(supplierItemsTable.supplierItemId, id))
    .returning();
  return { success: true };
}
