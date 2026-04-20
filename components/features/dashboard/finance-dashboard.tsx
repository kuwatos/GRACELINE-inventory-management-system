"use client";

import { DashboardNotifications } from "./dashboard-shared";
import { Notification } from "../notifications/notification-manager";

interface FinanceDashboardProps {
  notifications?: Notification[];
}

export const FinanceDashboard = ({ notifications = [] }: FinanceDashboardProps) => {
  return (
    <div className="space-y-6">
      <DashboardNotifications
        title="Notifications"
        viewAllLink="/finance/notifications"
        notifications={notifications}
      />
    </div>
  );
};