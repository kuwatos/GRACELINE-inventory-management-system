// CRUD lives here
import { db } from "../../index";
import { suppliersTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { createUserNotificationService } from "../user_notifications/user_notifications.service";
import { validateSessionUser } from "../user/user.repository";

// 1. CREATE WITH DYNAMIC LOGGING
export async function createSupplier(data: {
  supplierName: string;
  supplierLandline?: string;
  supplierEmail?: string;
  supplierMobile: string;
}) {
  return await db.transaction(async (tx) => {
    // Insert the new supplier
    const user = await validateSessionUser()
    const [newSupplier] = await tx.insert(suppliersTable).values(data).returning();

    if (newSupplier) {
      // Loop through every field in the newly created supplier
      for (const [key, val] of Object.entries(newSupplier)) {
        // Log every column that has a value
        if (val !== null && val !== undefined) {
          await createLog({
            userId: user.id,
            actionId: 12,                  // Added a New Supplier
            targetId: newSupplier.supplierId,
            columnName: key,               // Dynamic: supplierName, supplierEmail, etc.
            prevValue: null,
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }
      await createUserNotificationService({ notifId: 3, targetId: newSupplier.supplierId, additionalDescription: newSupplier.supplierName }, tx);
    }

    return newSupplier;
  });
}

// READ
export async function readSuppliers() {
  return db.select().from(suppliersTable);
}

// SEARCH
export async function searchSuppliers(filters: { keyword?: string }) {
  const conditions = [];
  if (filters.keyword) {
    conditions.push(ilike(suppliersTable.supplierName, `%${filters.keyword}%`));
  }
  return db
    .select()
    .from(suppliersTable)
    .where(and(...conditions));
}

// 2. UPDATE WITH DYNAMIC LOGGING
export async function updateSupplier(data: {
  id: number;
  supplierName?: string;
  supplierLandline?: string;
  supplierEmail?: string;
  supplierMobile?: string;
}) {
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    const user = await validateSessionUser()

    // Fetch current state
    const [existing] = await tx
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.supplierId, id))
      .limit(1);

    if (!existing) throw new Error("Supplier not found");

    const updates: Record<string, any> = {};

    // Diffing Logic
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        // Log each individual column change
        await createLog({
          userId: user.id,
          actionId: 13,                  // Edited a Supplier’s Details
          targetId: id,
          columnName: key,               // Dynamic field name
          prevValue: oldValue?.toString() ?? null,
          newValue: val.toString(),
          remarks: null
        }, tx);
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes detected" };

    // Finalize DB Update
    const [updatedSupplier] = await tx
      .update(suppliersTable)
      .set(updates)
      .where(eq(suppliersTable.supplierId, id))
      .returning();

    return updatedSupplier;
  });
}

// 3. DELETE WITH LOGGING
export async function deleteSupplier(id: number) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser()

    const [existing] = await tx
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.supplierId, id))
      .limit(1);

    if (!existing) throw new Error("Supplier not found");

    // Perform Delete
    await tx.update(suppliersTable).set({ active: false }).where(eq(suppliersTable.supplierId, id)).returning();

    // Log the deletion (Action ID 14)
    await createLog({
      userId: user.id,
      actionId: 14,
      targetId: id,
      columnName: "supplier_name",
      prevValue: existing.supplierName,
      newValue: null,
    }, tx);

    return { success: true };
  });
}

export async function findExistingSupplier(name:string) {
  return db.select().from(suppliersTable).where(ilike(suppliersTable.supplierName, name)).limit(1);
}

export async function restoreSupplier(
  id:number,
  data: {
    supplierName: string;
    supplierLandline?: string;
    supplierEmail?: string;
    supplierMobile: string;
  }) {
  return await db.transaction(async (tx) => {
    const user = await validateSessionUser()
    // Restore the supplier
    const [restoredSupplier] = await tx.update(suppliersTable)
      .set({ ...data, active: true })
      .where(eq(suppliersTable.supplierId, id))
      .returning();

    if (restoredSupplier) {
      // Loop through every field in the newly created supplier
      for (const [key, val] of Object.entries(restoredSupplier)) {
        // Log every column that has a value
        if (val !== null && val !== undefined) {
          await createLog({
            userId: user.id,
            actionId: 12,                  // Added a New Supplier
            targetId: restoredSupplier.supplierId,
            columnName: key,               // Dynamic: supplierName, supplierEmail, etc.
            prevValue: null,
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }
      await createUserNotificationService({ notifId: 3, targetId: restoredSupplier.supplierId, additionalDescription: restoredSupplier.supplierName }, tx);
    }

    return restoredSupplier;
  })}