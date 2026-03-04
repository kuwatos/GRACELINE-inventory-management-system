// CRUD lives here
import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq, lte, ilike, or, and } from "drizzle-orm";

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
  reorderLevel?: number;
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

//SEARCH
export async function searchItems(filters: {
  keyword?: string;
  category?: string;
  lowStock?: boolean;
}) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
  if (filters.keyword) {
    conditions.push(
      or(
        ilike(itemsTable.productName, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory1, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory2, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory3, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory4, `%${filters.keyword}%`),
        ilike(itemsTable.productCategory5, `%${filters.keyword}%`),
      ),
    );
  }

  //  Add category filter if selected
  if (filters.category) {
    conditions.push(eq(itemsTable.productCategory1, filters.category));
  }

  // Add numeric filter (e.g., Low Stock)
  if (filters.lowStock) {
    conditions.push(lte(itemsTable.productQuantity, itemsTable.reorderLevel));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(itemsTable)
    .where(and(...conditions));
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
