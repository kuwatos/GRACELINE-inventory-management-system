"use server";

import { db } from "@/src";
import { ordersTable } from "@/src/db/schema";
import { and, or, eq, gte, lte, inArray, count} from "drizzle-orm";

export async function getDashboardKpisAction() {
  // example — replace with your real queries
    const pendingOrders = await db
        .select({ count: count() })
        .from(ordersTable)
        .where(eq(ordersTable.orderStatus, "Awaiting Delivery"));
        
    const now = new Date();
    const weekStart = getWeekStart();
    const monthStart = getMonthStart();
    const completedStatuses = ["Complete", "Incomplete"] as const;

    // This week — Monday 00:00 to now
    const recentTransactionsWeek = await db
        .select({ count: count() })
        .from(ordersTable)
        .where(
        and(
            inArray(ordersTable.orderStatus, completedStatuses),
            gte(ordersTable.actualDeliveryDate, weekStart),
            lte(ordersTable.actualDeliveryDate, now)
        )
        );
    // This month — 1st of month 00:00 to now
    const recentTransactionsMonth = await db
        .select({ count: count() })
        .from(ordersTable)
        .where(
        and(
            inArray(ordersTable.orderStatus, completedStatuses),
            gte(ordersTable.actualDeliveryDate, monthStart),
            lte(ordersTable.actualDeliveryDate, now)
        )
        );

  return {
    kpiPendingOrders: pendingOrders[0]?.count ?? 0,
    kpiRecentTransactionsWeek: recentTransactionsWeek[0]?.count ?? 0,
    kpiRecentTransactionsMonth: recentTransactionsMonth[0]?.count ?? 0,
  };
}

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday...
  // Distance back to Monday (if today is Sunday, go back 6 days)
  const daysBack = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysBack);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}