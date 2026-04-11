import { db } from "../../index";
import { and, gte, lte, eq, sql, desc } from "drizzle-orm";import { 
  logsTable, 
  ordersTable, 
  orderProductsTable, 
  supplierItemsTable, 
  itemsTable,
  suppliersTable ,
  reportsTable,
   usersTable
} from "../../db/schema";

export async function readReportHistory() {
  return await db
    .select({
      reportId: reportsTable.reportId,
      reportType: reportsTable.reportType,
      dateCreated: reportsTable.dateCreated,
      username: usersTable.username, // Joined from User table
      dateStart: reportsTable.dateStart,
      dateEnd: reportsTable.dateEnd,
    })
    .from(reportsTable)
    .innerJoin(usersTable, eq(reportsTable.userId, usersTable.id));
}

export async function generateMonthlyAudit(startDate: Date, endDate: Date) {
  
  // 1. & 2. Magkano Binili vs Binayaran per Supplier
  const supplierSpending = await db
    .select({
      supplierName: suppliersTable.supplierName,
      totalPurchased: sql<number>`SUM(${orderProductsTable.orderProductQuantity} * ${supplierItemsTable.unitPrice})`,
      totalPaid: sql<number>`SUM(
        CASE WHEN ${ordersTable.orderStatus} = 'Paid' 
        THEN ${orderProductsTable.orderProductQuantity} * ${supplierItemsTable.unitPrice} 
        ELSE 0 END
      )`,
    })
    .from(ordersTable)
    .innerJoin(suppliersTable, eq(ordersTable.supplierId, suppliersTable.supplierId))
    .innerJoin(orderProductsTable, eq(ordersTable.orderId, orderProductsTable.orderId))
    .innerJoin(supplierItemsTable, and(
        eq(orderProductsTable.productId, supplierItemsTable.productId),
        eq(ordersTable.supplierId, supplierItemsTable.supplierId)
    ))
    .where(and(
      gte(ordersTable.orderDate, startDate),
      lte(ordersTable.orderDate, endDate)
    ))
    .groupBy(suppliersTable.supplierName);

  // 3. Parating na Mats (Orders that are 'Pending' or 'In Transit')
  const incomingMaterials = await db
    .select({
      supplierName: suppliersTable.supplierName,
      productName: itemsTable.productName,
      quantity: orderProductsTable.orderProductQuantity,
      status: ordersTable.orderStatus,
      eta: ordersTable.expectedDeliveryDate,
    })
    .from(ordersTable)
    .innerJoin(suppliersTable, eq(ordersTable.supplierId, suppliersTable.supplierId))
    .innerJoin(orderProductsTable, eq(ordersTable.orderId, orderProductsTable.orderId))
    .innerJoin(itemsTable, eq(orderProductsTable.productId, itemsTable.productId))
    .where(and(
      eq(ordersTable.orderStatus, 'Pending'), // Adjust status name as needed
      gte(ordersTable.orderDate, startDate),
      lte(ordersTable.orderDate, endDate)
    ));

  // 4. Start and End Inventory (Reconstructed from Logs)
  // We look for the last 'product_quantity' log entry BEFORE the dates
  const inventorySnapshot = await db.transaction(async (tx) => {
    const items = await tx.select().from(itemsTable);
    
    const snapshots = await Promise.all(items.map(async (item) => {
      // Get qty at the very start of the month
      const startLog = await tx.query.logsTable.findFirst({
        where: and(
          eq(logsTable.targetId, item.productId),
          eq(logsTable.columnName, 'product_quantity'),
          lte(logsTable.logDate, startDate)
        ),
        orderBy: [desc(logsTable.logDate)]
      });

      // Get qty at the very end of the month
      const endLog = await tx.query.logsTable.findFirst({
        where: and(
          eq(logsTable.targetId, item.productId),
          eq(logsTable.columnName, 'product_quantity'),
          lte(logsTable.logDate, endDate)
        ),
        orderBy: [desc(logsTable.logDate)]
      });

      return {
        productName: item.productName,
        startQty: startLog ? parseInt(startLog.newValue || "0") : 0,
        endQty: endLog ? parseInt(endLog.newValue || "0") : parseInt(item.productQuantity?.toString() || "0"),
      };
    }));

    return snapshots;
  });

  return {
    spending: supplierSpending,
    incoming: incomingMaterials,
    inventory: inventorySnapshot
  };
}