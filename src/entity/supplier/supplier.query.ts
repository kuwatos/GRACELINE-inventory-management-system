import { db } from "../../index";
import { suppliersTable } from "../../db/schema";
import { eq} from "drizzle-orm";

export async function readSuppliers() {
  return db.select().from(suppliersTable).where(eq(suppliersTable.active, true));
}
