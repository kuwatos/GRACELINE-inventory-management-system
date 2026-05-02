import { db } from "../../index";
import { supplierItemsTable, suppliersTable } from "../../db/schema";
import { and, eq, exists} from "drizzle-orm";

export async function readSuppliers() {
  return db.select().from(suppliersTable).where(eq(suppliersTable.active, true));
}

export async function readSuppliersAndId() {
  return db
  .select({ supplierId: suppliersTable.supplierId, supplierName: suppliersTable.supplierName,

   })
   .from(suppliersTable)
   .where(eq(suppliersTable.active, true));
}

export async function readSuppliersAndIdHavingProducts() {
  return db
  .select({ supplierId: suppliersTable.supplierId, supplierName: suppliersTable.supplierName,

   })
   .from(suppliersTable)
   .where(
    and(
      (eq(suppliersTable.active, true)),
      eq(suppliersTable.active, true),
        // Filter: only return if an entry exists in supplierItems table
        exists(
          db.select()
            .from(supplierItemsTable)
            .where(eq(supplierItemsTable.supplierId, suppliersTable.supplierId))
        )
      )
   );
}