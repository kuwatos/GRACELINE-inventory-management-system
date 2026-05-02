import { FinanceDashboard } from '@/components/features/dashboard/finance-dashboard'
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query';

export default async function FinanceDashboardPage() {
  const notifications = await readUserNotifications();
  return (
      <FinanceDashboard notifications={notifications} />
  );
}