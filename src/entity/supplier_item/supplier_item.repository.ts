// CRUD lives here
import { db } from "../../index";
import { supplierItemsTable } from "../../db/schema";
import { eq, lte, ilike, or } from "drizzle-orm";

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

//UPDATE
export async function updateItem(data: {
  id: number;
  supplierId?: number;
  productId?: number;
  unitPrice?: string;
}) {
  const { id, ...fields } = data;

  return db
    .update(supplierItemsTable)
    .set({ ...fields })
    .where(eq(supplierItemsTable.supplierItemId, data.id))
    .returning();
}

//DELETE
export async function deleteItem(id: number) {
  return db
    .delete(supplierItemsTable)
    .where(eq(supplierItemsTable.productId, id))
    .returning();
}
