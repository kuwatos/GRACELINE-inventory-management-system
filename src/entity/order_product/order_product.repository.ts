// CRUD lives here
import { db } from "../../index";
import { itemsTable, orderProductsTable, ordersTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { PgTransaction } from "drizzle-orm/pg-core";
import { updateItem } from "../item/item.repository";


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
    .where(eq(orderProductsTable.orderId, id))
    .returning();
  return {success:true}
}

//ADD DELIVERY ITEMS
export async function inputDeliveredItemQuantity(data : {
  orderId: number
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
    
    const prevDeliveredQuantity = orderProduct.deliveredOrderProductQuantity ?? 0
    const [addedOrderProductQuantity] = await tx
      .update(orderProductsTable)
      .set({ deliveredOrderProductQuantity: prevDeliveredQuantity + data.quantity})
      .where(eq(orderProductsTable.orderProductId, data.orderProductId))
      .returning();

    if (!orderProduct.productId) {
    // Handle the error or return early
    throw new Error("Product ID is missing for this item, changes not saved.");
}
    const [inventoryItem] = await tx
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.productId, orderProduct.productId))
      .limit(1)

    const newInventoryQuantity = inventoryItem.productQuantity + data.quantity

    const addedInventoryQuantity = await updateItem({
      id: inventoryItem.productId,
      productQuantity: newInventoryQuantity,
      remarks: "Recieved from Order:" + data.orderId.toString()
    }, tx);

    if(addedOrderProductQuantity && addedInventoryQuantity) {
      await createLog({
        userId: data.userId,
        actionId: 19, // Edited (specifically delivered)
        targetId: "order_product_id",
        columnName: "deliveredOrderProductQuantity",
        prevValue: null,
        newValue: data.quantity.toString(),
        remarks: null
      }, tx);
    }
    return addedOrderProductQuantity;
  });
}

export async function verifyDeliveryCompletion(expected: number, delivered: number | null) {
  const currentDelivered = delivered ?? 0;
  const isFullyDelivered = currentDelivered >= expected;

  return {
    isFullyDelivered
  };
}