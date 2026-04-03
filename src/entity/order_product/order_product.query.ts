import { db } from "../../index";
import { orderProductsTable } from "../../db/schema";
import { eq } from "drizzle-orm";
export async function readOrderProducts(data: { id: number }) {
  return db
    .select()
    .from(orderProductsTable)
    .where(eq(orderProductsTable.orderId, data.id));
}
