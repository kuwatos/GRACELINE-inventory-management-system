// CRUD lives here
import { db } from "../../index";
import { suppliersTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";

//CREATE
export async function createSupplier(data: {
  supplierName: string;
  supplierLandline?: string;
  supplierEmail?: string;
  supplierMobile: string;
}) {
  return db.insert(suppliersTable).values(data).returning();
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
  const { id, ...fields } = data;

  return db
    .update(suppliersTable)
    .set(fields)
    .where(eq(suppliersTable.supplierId, data.id));
}

//DELETE
export async function deleteSupplier(id: number) {
  return db
    .delete(suppliersTable)
    .where(eq(suppliersTable.supplierId, id))
    .returning();
}
