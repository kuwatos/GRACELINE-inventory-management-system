// CRUD lives here
import { db } from "../../index";
import { orderProductsTable, ordersTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";

//CREATE
export async function createOrderProducts(data: {
  orderId: number;
  productId: number;
  orderProductQuantity: number;
}) {
  return db.insert(orderProductsTable).values(data).returning();
}

//READ
// This read function is grouped by orderId
export async function readOrderProducts(data: { id: number }) {
  return db
    .select()
    .from(orderProductsTable)
    .where(eq(orderProductsTable.orderId, data.id));
}

//UPDATE
// You can only change the quantity of the order product, so the only updatable field is orderProductQuantity
export async function updateOrderProducts(data: {
  id: number;
  productId: number;
  orderProductQuantity: number;
}) {
  const { id, ...fields } = data;

  return db
    .update(orderProductsTable)
    .set(fields)
    .where(eq(orderProductsTable.orderProductId, data.id));
}

//DELETE
export async function deleteOrderProducts(id: number) {
  await db
    .delete(orderProductsTable)
    .where(eq(orderProductsTable.orderProductId, id))
    .returning();
  return {success:true}
}
