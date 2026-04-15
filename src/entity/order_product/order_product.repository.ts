// CRUD lives here
import { db } from "../../index";
import { orderProductsTable, ordersTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { PgTransaction } from "drizzle-orm/pg-core";


// Type definition for the transaction context
type Transaction = PgTransaction<any, any, any>;


//CREATE
export async function createOrderProducts(data: {
  orderId: number;
  productId: number;
  expectedOrderProductQuantity: number;
}) {
  return db.insert(orderProductsTable).values(data).returning();
}

//READ
// This read function is grouped by orderId
export async function readOrderProducts(data: { id: number }, prevTx: Transaction) {
  const client = prevTx ?? db;

  return client
    .select()
    .from(orderProductsTable)
    .where(eq(orderProductsTable.orderId, data.id));
}

//DELETE
export async function deleteOrderProducts(id: number) {
  await db
    .delete(orderProductsTable)
    .where(eq(orderProductsTable.orderProductId, id))
    .returning();
  return {success:true}
}

//ADD DELIVERY ITEMS
export async function inputDeliveredItemQuantity(data : {
  orderProductId: number, 
  quantity: number, 
  userId: string, 
  }, prevTx?: Transaction) {

  const client = prevTx ?? db;

  return await client.transaction(async (tx) => {
    const [orderProduct] = await tx
        .select()
        .from(orderProductsTable)
        .where(eq(orderProductsTable.orderProductId, data.orderProductId))
        .limit(1);

    if(!orderProduct) throw new Error("Order product not found");

    const [addedOrderProduct] = await tx
      .update(orderProductsTable)
      .set({ deliveredOrderProductQuantity: data.quantity})
      .where(eq(orderProductsTable.orderProductId, data.orderProductId))
      .returning();

    if(addedOrderProduct) {
      await createLog({
        userId: data.userId,
        actionId: 19, // Edited (specifically the delivered)
        targetId: "order_product_id",
        columnName: "deliveredOrderProductQuantity",
        prevValue: null,
        newValue: data.quantity.toString(),
        remarks: null
      }, tx);
    }
    return addedOrderProduct;
  });
}

export async function verifyDeliveryCompletion(expected: number, delivered: number | null) {
  const currentDelivered = delivered ?? 0;
  const isFullyDelivered = currentDelivered >= expected;

  return {
    isFullyDelivered
  };
}