import { db } from "../../index";
import {
  itemsTable,
  supplierItemsTable,
  suppliersTable,
} from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readItemsWithSupplier() {
  return await db
    .select({
      supplierItemId: supplierItemsTable.supplierItemId,
      supplierId: supplierItemsTable.supplierId,
      supplierName: suppliersTable.supplierName,
      productId: supplierItemsTable.productId,
      productName: itemsTable.productName,
      category1: itemsTable.productCategory1,
      category2: itemsTable.productCategory2,
      unitPrice: supplierItemsTable.unitPrice,
      lastUpdated: supplierItemsTable.lastUpdated,
      measurement: itemsTable.measurement
    })
    .from(supplierItemsTable)
    .innerJoin(
      itemsTable,
      eq(supplierItemsTable.productId, itemsTable.productId),
    )
    .innerJoin(
      suppliersTable,
      eq(supplierItemsTable.supplierId, suppliersTable.supplierId),
    )
    .orderBy(suppliersTable.supplierName)
    .where(eq(supplierItemsTable.archived, false));
}

export async function getSupplierItems(supplierId: number) {
  return await db
  .select()
  .from(supplierItemsTable)
  .where(eq(supplierItemsTable.supplierId, supplierId))
}
