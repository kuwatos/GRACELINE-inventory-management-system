// CRUD lives here
import { db } from "../../index";
import { suppliersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

//CREATE
export async function createSupplier(data: {
  supplierName: string;
  supplierContact: string;
}) {
  return db.insert(suppliersTable).values(data).returning();
}

//READ
export async function readSuppliers() {
  return db.select().from(suppliersTable);
}

//UPDATE
//Note: Depending on the execution, we can split this into two functions:
// one for updating the name, and another for updating the contact.
// For now, we can just have one function that updates both.
// Doing it exhaustively can make logs easier.
export async function updateSupplier(data: {
  id: number;
  supplierName: string;
  supplierContact: string;
}) {
  return db
    .update(suppliersTable)
    .set({
      supplierName: data.supplierName,
      supplierContact: data.supplierContact,
    })
    .where(eq(suppliersTable.supplierId, data.id));
}

//DELETE
export async function deleteSupplier(id: number) {
  return db.delete(suppliersTable).where(eq(suppliersTable.supplierId, id));
}
