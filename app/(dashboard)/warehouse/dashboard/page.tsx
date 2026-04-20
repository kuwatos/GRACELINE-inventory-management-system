import { WarehouseDashboard } from '@/components/features/dashboard/warehouse-dashboard'
import { getOrdersAction } from '@/lib/action/order.action';
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query';

export default async function WarehouseDashboardPage() {
  const [notifications, allOrders] = await Promise.all([
    readUserNotifications(),
    getOrdersAction(),
  ]);

  // Filter to only awaiting delivery on the server
  const pendingOrders = allOrders.filter((o) => o.status === "Awaiting Delivery");

  return (
    <div className="p-8">
      <WarehouseDashboard
        notifications={notifications}
        pendingOrders={pendingOrders}
      />
    </div>
  );
}