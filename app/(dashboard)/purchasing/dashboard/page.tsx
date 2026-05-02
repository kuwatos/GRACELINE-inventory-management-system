import { PurchasingDashboard } from '@/components/features/dashboard/purchasing-dashboard'
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query';
import { getDashboardKpisAction, } from "@/lib/action/dashboard.action";
import { readLowStockItems } from "@/src/entity/item/item.repository";

export default async function PurchasingDashboardPage() {
  const [kpis, notifications, lowStockItems] = await Promise.all([
    getDashboardKpisAction(),
    readUserNotifications(),
    readLowStockItems(),       // called directly — no action wrapper needed
  ]);

  return (
      <PurchasingDashboard
        notifications={notifications}
        lowStockItems={lowStockItems.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          productQuantity: i.productQuantity,
          reorderLevel: i.reorderLevel,
        }))}
        kpiPendingOrders={kpis.kpiPendingOrders}
        kpiRecentTransactionsWeek={kpis.kpiRecentTransactionsWeek}
        kpiRecentTransactionsMonth={kpis.kpiRecentTransactionsMonth}
      />
  );
}