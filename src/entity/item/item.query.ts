import { db } from "../../index";
import { itemsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readItems() {
  return db.select().from(itemsTable).where(eq(itemsTable.archived, false));
}
