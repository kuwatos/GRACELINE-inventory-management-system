import { db } from "../../index";
import {
  ordersTable,
  suppliersTable,
  projectsTable,
  usersTable,
} from "../../db/schema";
import { eq, aliasedTable } from "drizzle-orm";

type PurchaseOrderRow = {
  poId: number;
  supplierId: number;
  projectId: number | null;
  supplierName: string;
  projectName: string;
  createdBy: string;
  approvedBy: string | null;
  dateCreated: Date | null;
  expectedDelivery: Date | null;
  actualDelivery: Date | null;
  status: string;
  orderedValue: string | null;    // ADD
  receivedValue: string | null;   // ADD
};

export async function readPurchaseOrderHistory(): Promise<PurchaseOrderRow[]> {
  const creator = aliasedTable(usersTable, "creator");
  const approver = aliasedTable(usersTable, "approver");

  const result = await db
    .select({
      poId: ordersTable.orderId,
      supplierId: ordersTable.supplierId,       // ADD — needed for edit modal
      projectId: ordersTable.projectId,         // ADD — needed for edit modal
      supplierName: suppliersTable.supplierName,
      projectName: projectsTable.projectName,
      createdBy: creator.username,
      approvedBy: approver.username,
      dateCreated: ordersTable.orderDate,
      expectedDelivery: ordersTable.expectedDeliveryDate,
      actualDelivery: ordersTable.actualDeliveryDate,
      status: ordersTable.orderStatus,
      orderedValue: ordersTable.orderedValue,     // ADD
      receivedValue: ordersTable.receivedValue,   // ADD
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
    .innerJoin(creator, eq(ordersTable.createdBy, creator.id))
    // Join Approver (User) - Left Join in case it's not approved yet
    .leftJoin(approver, eq(ordersTable.approvedBy, approver.id));

    return result as PurchaseOrderRow[];
}
