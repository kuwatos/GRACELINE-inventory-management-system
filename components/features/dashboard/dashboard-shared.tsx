"use client";

import { ArrowRight, AlertTriangle, Package, Truck, Hash, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Notification } from "../notifications/notification-manager";

interface DashboardNotificationsProps {
  title?: string;
  viewAllLink: string;
  notifications: Notification[];
}
  
export const DashboardNotifications = ({ title = "Notifications", viewAllLink, notifications }: DashboardNotificationsProps) => (
  <Card className="p-6 md:p-8 rounded-2xl border-gray-200 shadow-sm bg-white">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <Link href={viewAllLink} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
        View All Notifications <ArrowRight className="w-4 h-4" />
      </Link>
    </div>

    <div className="space-y-3">
      {notifications.slice(0, 3).map((notif) => (
        <div
          key={notif.userNotifId}
          className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl shrink-0 bg-[#0f172a] flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[15px] text-gray-900 leading-tight">
                {notif.description}
              </h4>
              {notif.targetId !== null && notif.targetId !== 0 && (
                <span className="flex items-center gap-0.5 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold w-fit">
                  <Hash className="w-2.5 h-2.5" />
                  {notif.targetId}
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "—"}
              </span>
            </div>
          </div>

          {/* Read indicator — no action on dashboard, just visual */}
          <div className="p-2 text-gray-200 rounded-xl shrink-0">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No new notifications.</p>
      )}
    </div>
  </Card>
);

// --- KPI CARD --- (unchanged)
interface KpiCardProps {
  title: string;
  value: string | number;
  subtext1: string;
  subtext2: string;
  icon: React.ReactNode;
}

export const KpiCard = ({ title, value, subtext1, subtext2, icon }: KpiCardProps) => (
  <Card className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white flex flex-col justify-between h-full min-h-[200px]">
    <div>
      <div className="bg-gray-100/80 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-gray-800">
        {icon}
      </div>
      <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
      <p className="text-4xl font-normal tracking-tight text-gray-900">{value}</p>
    </div>
    <div className="border-t border-gray-100 mt-6 pt-4 space-y-1">
      <p className="text-[11px] text-gray-500 font-medium">{subtext1}</p>
      <p className="text-[11px] text-gray-500 font-medium">{subtext2}</p>
    </div>
  </Card>
);