import { AdminDashboard } from '@/components/features/dashboard/admin-dashboard'
import { getDashboardKpisAction } from '@/lib/action/dashboard.action';
import { readLogsWithUser } from '@/src/entity/log/log.query';
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query';
import React from 'react'
export default async function AdminDashboardPage() {
  const [kpis, activities, notifications] = await Promise.all([
    getDashboardKpisAction(),
    readLogsWithUser(),
    readUserNotifications(),
  ]);

  return (
    <AdminDashboard
      notifications={notifications}
      activities={activities}
      kpiPendingOrders={kpis.kpiPendingOrders}
      kpiRecentTransactionsWeek={kpis.kpiRecentTransactionsWeek}
      kpiRecentTransactionsMonth={kpis.kpiRecentTransactionsMonth}
    />
  )
}
