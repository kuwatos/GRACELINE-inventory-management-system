// CRUD lives here
import { db } from "../../index";
import { suppliersTable, logsTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";

// 1. CREATE WITH LOGGING
export async function createSupplier(data: {
  supplierName: string;
  supplierLandline?: string;
  supplierEmail?: string;
  supplierMobile: string;
}) {
  return await db.transaction(async (tx) => {
    const [newSupplier] = await tx.insert(suppliersTable).values(data).returning();

    // Log the creation (Action ID 12)
    // await tx.insert(logsTable).values({
    //   actionId: 12,
    //   targetId: newSupplier.supplierId,
    //   newValue: newSupplier.supplierName,
    // });

    return newSupplier;
  });
}

//READ
export async function readSuppliers() {
  return db.select().from(suppliersTable);
}

//SEARCH
export async function searchSuppliers(filters: { keyword?: string }) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
  if (filters.keyword) {
    conditions.push(ilike(suppliersTable.supplierName, `%${filters.keyword}%`));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(suppliersTable)
    .where(and(...conditions));
}

//UPDATE
export async function updateSupplier(data: {
  id: number;
  supplierName?: string;
  supplierLandline?: string;
  supplierEmail?: string;
  supplierMobile?: string;
}) {
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // Fetch current state
    const [existing] = await tx
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.supplierId, id))
      .limit(1);

    if (!existing) throw new Error("Supplier not found");

    const updates: Record<string, any> = {};
    const logEntries = [];

    // Diffing Logic
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        logEntries.push({
          actionId: 13, // Edited a Supplier’s Details
          targetId: id,
          prevValue: oldValue?.toString() ?? null,
          newValue: val.toString()        });
      }
    }

    if (logEntries.length === 0) return { message: "No changes detected" };

    await tx.update(suppliersTable).set(updates).where(eq(suppliersTable.supplierId, id));
    await tx.insert(logsTable).values(logEntries);

    return { success: true, count: logEntries.length };
  });
}

//DELETE
export async function deleteSupplier(id: number) {
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(suppliersTable)
      .where(eq(suppliersTable.supplierId, id))
      .limit(1);

    if (!existing) throw new Error("Supplier not found");

    // Perform Delete
    await tx.delete(suppliersTable).where(eq(suppliersTable.supplierId, id));

    // Log the deletion (Action ID 14)
    await tx.insert(logsTable).values({
      actionId: 14,
      targetId: id,
      prevValue: existing.supplierName,
      newValue: null,
    });

    return { success: true };
  });
}