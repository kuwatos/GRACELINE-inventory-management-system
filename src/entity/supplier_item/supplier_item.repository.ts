// CRUD lives here
import { db } from "../../index";
import { supplierItemsTable, suppliersTable, itemsTable } from "../../db/schema";
import { eq, and} from "drizzle-orm";
import { createUserNotificationService } from "../user_notifications/user_notifications.service";
import { createLog } from "../log/log.repository";
import { validateSessionUser } from "../user/user.repository";

//CREATE
export async function createSupplierItem(data: {
  supplierId: number;
  productId: number;
  unitPrice: string;
}) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser();
    // 1. Insert the new link record
    const [newLink] = await tx.insert(supplierItemsTable).values(data).returning();

    if (newLink) {
      // 2. Iterate through the record to generate logs for every field
      for (const [key, val] of Object.entries(newLink)) {
        // Skip null/undefined values to keep logs clean
        if (val !== null && val !== undefined) {
          await createLog({
            userId: user.id,    // Use the logged-in user's ID, or null for system actions
            actionId: 21,                   // [BLANK] - Fill in for "Link Supplier Item"
            targetId: newLink.supplierItemId.toString(), // The ID of the new supplier-item link
            columnName: key,
            prevValue: null,
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }

      // 3. Trigger the notification service
      const getSupplierName = await tx
        .select({ supplierName: suppliersTable.supplierName })
        .from(suppliersTable)
        .where(eq(suppliersTable.supplierId, newLink.supplierId!))
        .limit(1);

      const getProductName = await tx
        .select({ productName: itemsTable.productName })
        .from(itemsTable)
        .where(eq(itemsTable.productId, newLink.productId))
        .limit(1);

      await createUserNotificationService({ 
        notifId: 8,                        // [BLANK] - Fill in for "New Item Linked"
        targetId: newLink.supplierItemId,
        additionalDescription: `${getProductName[0]?.productName || "Unknown Product"} - ${getSupplierName[0]?.supplierName || "Unknown Supplier"}`
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
    const user = await validateSessionUser()

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
          userId: user.id,    // Use the logged-in user's ID, or null for system actions
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
    const getSupplierName = await tx
        .select({ supplierName: suppliersTable.supplierName })
        .from(suppliersTable)
        .where(eq(suppliersTable.supplierId, updated.supplierId!))
        .limit(1);

      const getProductName = await tx
        .select({ productName: itemsTable.productName })
        .from(itemsTable)
        .where(eq(itemsTable.productId, updated.productId))
        .limit(1);

    if (existing.productId !== null) {
      await createUserNotificationService({ notifId: 8, targetId: existing.productId, additionalDescription: `${getProductName[0]?.productName || "Unknown Product"} - ${getSupplierName[0]?.supplierName || "Unknown Supplier"}` }, tx);
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

export async function deleteAllLinksForSupplier(supplierId: number) {
  await db
    .update(supplierItemsTable)
    .set({ archived: true })
    .where(eq(supplierItemsTable.supplierId, supplierId))
    .returning();
  return { success: true };
}

export async function restoreAllLinksForSupplier(supplierId: number) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser();

    // 1. Perform the bulk update
    const restoredItems = await tx
      .update(supplierItemsTable)
      .set({ archived: false })
      .where(eq(supplierItemsTable.supplierId, supplierId))
      .returning();

    // 2. Loop through all restored items to log and notify
    if (restoredItems.length > 0) {
      for (const item of restoredItems) {
        // Log the specific 'archived' change for each item
        await createLog({
          userId: user.id,
          actionId: 21, // "Restore Item Link"
          targetId: item.supplierItemId,
          columnName: "archived",
          prevValue: "true",
          newValue: "false",
          remarks: `Bulk restore for supplier ID: ${supplierId}`
        }, tx);

        // 3. Trigger notification for each restored link
        const getSupplierName = await tx
        .select({ supplierName: suppliersTable.supplierName })
        .from(suppliersTable)
        .where(eq(suppliersTable.supplierId, item.supplierId!))
        .limit(1);

      const getProductName = await tx
        .select({ productName: itemsTable.productName })
        .from(itemsTable)
        .where(eq(itemsTable.productId, item.productId))
        .limit(1);

        await createUserNotificationService({ 
          notifId: 8, // "Item Link Restored"
          targetId: item.supplierItemId 
          ,additionalDescription: `${getProductName[0]?.productName || "Unknown Product"} - ${getSupplierName[0]?.supplierName || "Unknown Supplier"}`
        }, tx);
      }
    }

    return { success: true, count: restoredItems.length };
  });
}

export async function restoreSupplierItem(data: {
  id: number; // 👈 This is the supplierItemId
  supplierId: number;
  unitPrice: string;
}) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser();
    const [restoredSupplierItem] = await tx
      .update(supplierItemsTable)
      .set({ 
        archived: false,
        supplierId: data.supplierId,
        unitPrice: data.unitPrice
       })
      .where(eq(supplierItemsTable.supplierItemId, data.id))
      .returning();

    if (restoredSupplierItem) {
      for (const [key, val] of Object.entries(restoredSupplierItem)) {
        // Skip null/undefined values to keep logs clean
        if (val !== null && val !== undefined) {
          await createLog({
            userId: user.id,    // Use the logged-in user's ID, or null for system actions
            actionId: 21,                   // [BLANK] - Fill in for "Link Supplier Item"
            targetId: restoredSupplierItem.supplierItemId,
            columnName: key,
            prevValue: null,
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }

      // 3. Trigger the notification service
      const getSupplierName = await tx
        .select({ supplierName: suppliersTable.supplierName })
        .from(suppliersTable)
        .where(eq(suppliersTable.supplierId, restoredSupplierItem.supplierId!))
        .limit(1);

      const getProductName = await tx
        .select({ productName: itemsTable.productName })
        .from(itemsTable)
        .where(eq(itemsTable.productId, restoredSupplierItem.productId))
        .limit(1);

      await createUserNotificationService({ 
        notifId: 8,                        // [BLANK] - Fill in for "New Item Linked"
        targetId: restoredSupplierItem.supplierItemId 
        ,additionalDescription: `${getProductName[0]?.productName || "Unknown Product"} - ${getSupplierName[0]?.supplierName || "Unknown Supplier"}`
      }, tx);
    }

    return restoredSupplierItem;
  })
}

