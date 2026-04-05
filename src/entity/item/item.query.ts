import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readItems() {
  return db.select().from(itemsTable).where(eq(itemsTable.archived, false));
}

export async function readItemsAndId() {
  return db.select({ productId: itemsTable.productId, productName: itemsTable.productName }).from(itemsTable).where(eq(itemsTable.archived, false));
}

