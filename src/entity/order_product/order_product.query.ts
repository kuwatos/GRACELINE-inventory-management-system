import { db } from "../../index";
import { orderProductsTable, ordersTable, supplierItemsTable, itemsTable } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export async function readOrderProducts(data: { id: number }) {
  return db
    .select({
      orderProductId: orderProductsTable.orderProductId,   // ADD
      productId: orderProductsTable.productId,
      productName: itemsTable.productName,         // for display in modals
      productCategory1: itemsTable.productCategory1,   // ADD
      measurement: itemsTable.measurement,             // ADD
      expectedQty: orderProductsTable.expectedOrderProductQuantity,
      receivedQty: orderProductsTable.deliveredOrderProductQuantity,
      unitPrice: supplierItemsTable.unitPrice,     // text in DB, parsed to number later
    })
    .from(orderProductsTable)
    // Join ordersTable so we can access supplierId for the next join
    .innerJoin(ordersTable, eq(orderProductsTable.orderId, ordersTable.orderId))
    // Join supplierItemsTable on BOTH productId AND supplierId to get the right price
    .leftJoin(
      supplierItemsTable,
      and(
        eq(orderProductsTable.productId, supplierItemsTable.productId),
        eq(ordersTable.supplierId, supplierItemsTable.supplierId)
      )
    )
    // Join itemsTable to get the product name
    .innerJoin(itemsTable, eq(orderProductsTable.productId, itemsTable.productId))
    .where(eq(orderProductsTable.orderId, data.id));
}