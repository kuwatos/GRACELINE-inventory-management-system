import { db } from "../../index";
import { and, gte, lte, eq, sql, desc, inArray, asc } from "drizzle-orm";import { 
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
    const targetId = item.productId.toString();

    // 1. Find the most recent log ON or BEFORE the startDate
    const startLog = await tx.query.logsTable.findFirst({
      where: and(
        eq(logsTable.targetId, targetId),
        eq(logsTable.columnName, 'product_quantity'),
        lte(logsTable.logDate, startDate)
      ),
      orderBy: [desc(logsTable.logDate)]
    });

    let calculatedStartQty = 0;

    if (startLog) {
      // If we found a log before the start date, its 'newValue' was the state at that time
      calculatedStartQty = parseInt(startLog.newValue || "0");
    } else {
      // FALLBACK: Find the FIRST ever log for this item to get the 'oldValue'
      const firstEverLog = await tx.query.logsTable.findFirst({
        where: and(
          eq(logsTable.targetId, targetId),
          eq(logsTable.columnName, 'product_quantity')
        ),
        orderBy: [asc(logsTable.logDate)]
      });
      
      // If the first log happened AFTER our startDate, the startQty is the 'oldValue' of that first log
      calculatedStartQty = firstEverLog ? parseInt(firstEverLog.prevValue || "0") : 0;
    }

    // 2. Find the most recent log ON or BEFORE the endDate
    const endLog = await tx.query.logsTable.findFirst({
      where: and(
        eq(logsTable.targetId, targetId),
        eq(logsTable.columnName, 'product_quantity'),
        lte(logsTable.logDate, endDate)
      ),
      orderBy: [desc(logsTable.logDate)]
    });

    return {
      productName: item.productName,
      measurement: item.measurement,
      startQty: calculatedStartQty,
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
