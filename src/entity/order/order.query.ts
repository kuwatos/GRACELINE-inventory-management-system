import { db } from "../../index";
import {
  ordersTable,
  suppliersTable,
  projectsTable,
  usersTable,
} from "../../db/schema";
import { eq, aliasedTable } from "drizzle-orm";

export async function readPurchaseOrderHistory() {
  const creator = aliasedTable(usersTable, "creator");
  const approver = aliasedTable(usersTable, "approver");

  return await db
    .select({
      poId: ordersTable.orderId,
      supplierName: suppliersTable.supplierName,
      projectName: projectsTable.projectName,
      createdBy: creator.username,
      approvedBy: approver.username,
      dateCreated: ordersTable.orderDate,
      expectedDelivery: ordersTable.expectedDeliveryDate,
      actualDelivery: ordersTable.actualDeliveryDate,
      status: ordersTable.orderStatus,
    })
    .from(ordersTable)
    // Join Supplier
    .innerJoin(
      suppliersTable,
      eq(ordersTable.supplierId, suppliersTable.supplierId),
    )
    // Join Project
    .innerJoin(
      projectsTable,
      eq(ordersTable.projectId, projectsTable.projectId),
    )
    // Join Creator (User)
    .innerJoin(creator, eq(ordersTable.createdBy, creator.userId))
    // Join Approver (User) - Left Join in case it's not approved yet
    .leftJoin(approver, eq(ordersTable.approvedBy, approver.userId));
}
