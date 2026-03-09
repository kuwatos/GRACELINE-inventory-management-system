import { db } from "../../index";
import { itemsTable } from "../../db/schema";

export async function readItems() {
  return db.select().from(itemsTable);
}
