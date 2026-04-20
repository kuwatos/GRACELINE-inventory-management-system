"use client";

import { Clock, Receipt, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardNotifications, KpiCard } from "./dashboard-shared";
import Link from "next/link";
import { Log } from "../activity/activity-log-table";
import { Notification } from "../notifications/notification-manager";

interface AdminDashboardProps {
  notifications?: Notification[];
  activities?: Log[];
  kpiPendingOrders?: number;
  kpiRecentTransactionsWeek?: number;
  kpiRecentTransactionsMonth?: number;
}

export const AdminDashboard = ({ 
  notifications = [],
  activities = [],
  kpiPendingOrders = 0,
  kpiRecentTransactionsWeek = 0,
  kpiRecentTransactionsMonth = 0,
}: AdminDashboardProps) => {
  return (
    <div className="space-y-6 ">

      {/* Top: Notifications */}
      <DashboardNotifications viewAllLink="/admin/notifications" notifications={notifications} />

      {/* Middle: KPIs */}
      <div className="flex gap-4">
        <KpiCard
          title="Pending Orders"
          value={kpiPendingOrders}
          subtext1=" "
          subtext2=" "
          icon={<Clock className="w-5 h-5" />}
        />
        <KpiCard
          title="Recent Transactions"
          value={kpiRecentTransactionsMonth}
          subtext1={`Mon – Today: ${kpiRecentTransactionsWeek}`}
          subtext2={`This Month: ${kpiRecentTransactionsMonth}`}
          icon={<Receipt className="w-5 h-5" />}
        />
      </div>

      {/* Bottom: Activity Log — 3 entries only */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Recent System Activity</h2>
          <Link
            href="/admin/activity"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View Full Activity Log <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No recent activity.</div>
        ) : (
          <Table className="text-sm border-collapse w-full">
            <TableHeader>
              {/* 👇 Disabled hover effect on header */}
              <TableRow className="bg-gray-50/50 hover:bg-transparent border-b border-gray-100">
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold whitespace-nowrap">Date & Time</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">User Account</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Department</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Action</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Column</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Target ID</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Prev</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">New</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Project</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.slice(0, 3).map((log) => (
                <TableRow
                  key={log.id}
                  className="group hover:bg-[#0f172a] transition-colors cursor-default border-b border-gray-50 last:border-0"
                >
                  <TableCell className="px-6 py-4 text-xs font-mono text-gray-500 group-hover:text-white transition-colors whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-800 group-hover:text-white transition-colors">
                    {log.user ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {/* 👇 Updated badge hover to white/20 */}
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {log.dept ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                    {log.action ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                    {log.column ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                    {log.target}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                    {log.prev ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                    {log.next ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                    {log.project ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
};