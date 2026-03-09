import { db } from "../../index";
import { suppliersTable } from "../../db/schema";

export async function readSuppliers() {
  return db.select().from(suppliersTable);
}
