import { db } from "../../index";
import { suppliersTable } from "../../db/schema";
import { eq} from "drizzle-orm";

export async function readSuppliers() {
  return db.select().from(suppliersTable).where(eq(suppliersTable.active, true));
}

export async function readSuppliersAndId() {
  return db.select({ supplierId: suppliersTable.supplierId, supplierName: suppliersTable.supplierName }).from(suppliersTable).where(eq(suppliersTable.active, true));
}