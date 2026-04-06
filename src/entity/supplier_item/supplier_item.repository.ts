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
  //   lastUpdated not included because it is defaulted as Now() in the schema, so it is not included in the input
}) {
  return db.insert(supplierItemsTable).values(data).returning();
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
          actionId: 12, 
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
export async function deleteItem(id: number) {
  await db
    .update(supplierItemsTable)
    .set({ archived: true })
    .where(eq(supplierItemsTable.supplierItemId, id))
    .returning();
  return { success: true };
}
