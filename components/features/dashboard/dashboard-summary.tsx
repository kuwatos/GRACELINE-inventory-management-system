"use client";

import { Clock, FileText, Truck, AlertCircle } from "lucide-react";
import { StatCard } from "./stat-card";

export const DashboardSummary = () => {
  const stats = {
    pendingOrders: 23,
    undeliveredOrders: 12,
    problematicOrders: 5,
    recentTransactions: 142,
    thisWeek: 47,
    thisMonth: 142
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={Clock}
      />

      <StatCard 
        title="Undelivered Orders"
        value={stats.undeliveredOrders}
        icon={Truck}
      />

      <StatCard 
        title="Problematic Orders"
        value={stats.problematicOrders}
        icon={AlertCircle}
      />
      
      <StatCard 
        title="Recent Transactions"
        value={stats.recentTransactions}
        icon={FileText}
        description={[
          { label: "This week", value: stats.thisWeek },
          { label: "This month", value: stats.thisMonth },
        ]}
      />
    </div>
  );
};