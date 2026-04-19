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
      totalPurchased: sql<number>`SUM(${orderProductsTable.expectedOrderProductQuantity} * ${supplierItemsTable.unitPrice})`,
      //total purchased value (official, di pa bayad)

      // PROBLEM: naisasama pa rin kahit yung drafts. dapat yung approved lang. need istore yung status
      // status galing logs, price galing sa order, di na iccompute per item, yung order nalang. kasi total price lang kailanganm
      // magbase sa order table nalang. yung completed and incomplete. tas may new columns sa order, receivedValue and orderValue (add na)
      // - schema change, sa supp items kasi kailangan masave yung old price. pag nagedit maaarchive yung luma
      // - save supplierItem id to orderProducts
      // - incomplete order new form 

      //add name sa notification. string naman na, concat nalang. need lang magadd ng notif.

      //add notifs sa dashboard

      totalPaid: sql<number>`SUM(
        CASE WHEN ${ordersTable.orderStatus} = 'Paid' 
        THEN ${orderProductsTable.deliveredOrderProductQuantity} * ${supplierItemsTable.unitPrice} 
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
          eq(logsTable.targetId, item.productId.toString()),
          eq(logsTable.columnName, 'product_quantity'),
          lte(logsTable.logDate, startDate)
        ),
        orderBy: [desc(logsTable.logDate)]
      });

      // Get qty at the very end of the month
      const endLog = await tx.query.logsTable.findFirst({
        where: and(
          eq(logsTable.targetId, item.productId.toString()),
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