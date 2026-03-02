// CRUD lives here
import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq, lte, ilike, or } from "drizzle-orm";

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

//READ ALL LOW STOCK
export async function readLowStockItems() {
  return db
    .select()
    .from(itemsTable)
    .where(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
}

//SEARCH BY KEYWORD
export async function searchItems(keyword: string) {
  return db
    .select()
    .from(itemsTable)
    .where(
      or(
        ilike(itemsTable.productName, `%${keyword}%`),
        ilike(itemsTable.productCategory1, `%${keyword}%`),
        ilike(itemsTable.productCategory2, `%${keyword}%`),
        ilike(itemsTable.productCategory3, `%${keyword}%`),
        ilike(itemsTable.productCategory4, `%${keyword}%`),
        ilike(itemsTable.productCategory5, `%${keyword}%`),
      ),
    );
}

//SEARCH BY CATEGORY
export async function filterItems(category: string) {
  return db
    .select()
    .from(itemsTable)
    .where(ilike(itemsTable.productCategory1, `%${category}%`));
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

export async function archiveItem(data: { id: number; archived: boolean }) {
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
