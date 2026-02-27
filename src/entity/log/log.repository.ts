// CRUD lives here
import { db } from "../../index";
import { logsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

//CREATE
export async function createItem(data: {
  productName: string;
  productCategory1: string;
  productCategory2?: string;
  productCategory3?: string;
  productCategory4?: string;
  productCategory5?: string;
  productDesc?: string;
  productQuantity?: number;
  reorderLevel: number;
}) {
  return db.insert(itemsTable).values(data).returning();
}

//READ
export async function readItems() {
  return db.select().from(itemsTable);
}

//UPDATE
export async function updateItem(data: {
  id: number;
  productName?: string;
  productCategory1?: string;
  productCategory2?: string;
  productCategory3?: string;
  productCategory4?: string;
  productCategory5?: string;
  productDesc?: string;
  productQuantity?: number;
  reorderLevel?: number;
}) {
  const { id, ...fields } = data;

  return db
    .update(itemsTable)
    .set(fields)
    .where(eq(itemsTable.productId, data.id));
}

//DELETE
export async function deleteItem(id: number) {
  return db.delete(itemsTable).where(eq(itemsTable.productId, id)).returning();
}
