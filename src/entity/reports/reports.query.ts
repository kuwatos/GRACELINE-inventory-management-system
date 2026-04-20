import { db } from "../../index";
import { and, gte, lte, eq, sql, desc, inArray } from "drizzle-orm";import { 
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
  
  // 1. Magkano Binili PER Supplier (Total Liability)
  // Statuses: Everything except "Draft" (Official equivalent here is "Awaiting payment")
  const totalPurchased = await db
    .select({
      supplierName: suppliersTable.supplierName,
      totalAmount: sql<number>`SUM(CAST(COALESCE(${ordersTable.orderedValue}, '0') AS NUMERIC))`.mapWith(Number),
    })
    .from(ordersTable)
    .innerJoin(suppliersTable, eq(ordersTable.supplierId, suppliersTable.supplierId))
    .where(and(
      inArray(ordersTable.orderStatus, [
        "Awaiting Delivery", 
        "Incomplete Delivery", 
        "Delivered", 
        "Complete", 
        "Incomplete"
      ]),
      gte(ordersTable.orderDate, startDate),
      lte(ordersTable.orderDate, endDate)
    ))
    .groupBy(suppliersTable.supplierName);

  // 2. Binayaran na PER Supplier (Total Paid)
  // Statuses: Not Draft/Awaiting Payment (Official). 
  // Includes: Complete, Incomplete, Awaiting delivery, Incomplete delivery, Delivered
  const totalPaid = await db
    .select({
      supplierName: suppliersTable.supplierName,
      paidAmount: sql<number>`SUM(CAST(COALESCE(${ordersTable.orderedValue}, '0') AS NUMERIC))`.mapWith(Number),
    })
    .from(ordersTable)
    .innerJoin(suppliersTable, eq(ordersTable.supplierId, suppliersTable.supplierId))
    .where(and(
      inArray(ordersTable.orderStatus, [
        "Awaiting Delivery", 
        "Incomplete Delivery", 
        "Delivered", 
        "Complete", 
        "Incomplete"
      ]),
      gte(ordersTable.orderDate, startDate),
      lte(ordersTable.orderDate, endDate)
    ))
    .groupBy(suppliersTable.supplierName);

  // 3. Parating na Mats (Incoming Materials)
  // Logic: Remaining = Expected Quantity - Delivered Quantity
  const incomingMaterials = await db
    .select({
      supplierName: suppliersTable.supplierName,
      productName: itemsTable.productName,
      // This calculates the "Balance" for partial receipts
      quantity: sql<number>`
        CASE 
          WHEN ${ordersTable.orderStatus} IN ( 'Incomplete') 
          THEN ${orderProductsTable.expectedOrderProductQuantity} - COALESCE(${orderProductsTable.deliveredOrderProductQuantity}, 0)
          ELSE ${orderProductsTable.expectedOrderProductQuantity}
        END
      `.mapWith(Number),
      status: ordersTable.orderStatus,
      eta: ordersTable.expectedDeliveryDate,
    })
    .from(ordersTable)
    .innerJoin(suppliersTable, eq(ordersTable.supplierId, suppliersTable.supplierId))
    .innerJoin(orderProductsTable, eq(ordersTable.orderId, orderProductsTable.orderId))
    .innerJoin(itemsTable, eq(orderProductsTable.productId, itemsTable.productId))
    .where(and(
      // We check for these statuses as they represent "In-Flight" or "Unfinished" items
      inArray(ordersTable.orderStatus, ["Awaiting Delivery", "Incomplete"]),
      gte(ordersTable.orderDate, startDate),
      lte(ordersTable.orderDate, endDate)
    ));
  // 4. Start and End Inventory (Reconstructed from logsTable)
  const inventorySnapshot = await db.transaction(async (tx) => {
    const items = await tx.select().from(itemsTable);
    
    const snapshots = await Promise.all(items.map(async (item) => {
      // Find quantity at the start of the range
      const startLog = await tx.query.logsTable.findFirst({
        where: and(
          eq(logsTable.targetId, item.productId.toString()),
          eq(logsTable.columnName, 'product_quantity'),
          lte(logsTable.logDate, startDate)
        ),
        orderBy: [desc(logsTable.logDate)]
      });

      // Find quantity at the end of the range
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
        measurement: item.measurement,
        startQty: startLog ? parseInt(startLog.newValue || "0") : 0,
        endQty: endLog ? parseInt(endLog.newValue || "0") : item.productQuantity,
      };
    }));

    return snapshots;
  });

  return {
    purchased: totalPurchased,
    paid: totalPaid,
    incoming: incomingMaterials,
    inventory: inventorySnapshot,

  };
}


