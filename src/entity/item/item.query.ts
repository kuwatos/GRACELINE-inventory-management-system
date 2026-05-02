import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readItems() {
  return db.select().from(itemsTable).where(eq(itemsTable.archived, false));
}

// src/entity/item/item.query.ts (or wherever this is located)
export async function readItemsAndId() {
  return db
    .select({ 
      productId: itemsTable.productId, 
      productName: itemsTable.productName,
      productCategory1: itemsTable.productCategory1, // Added
      measurement: itemsTable.measurement           // Added
    })
    .from(itemsTable)
    .where(eq(itemsTable.archived, false));
}
