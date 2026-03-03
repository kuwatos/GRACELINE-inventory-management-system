"use client";

import { ArrowRight, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

// --- NOTIFICATIONS PANEL ---
export interface NotificationItem {
  id: string;
  title: string;
  subtext1: string;
  subtext2?: string;
  icon: React.ReactNode;
}

interface DashboardNotificationsProps {
  title?: string;
  viewAllLink: string;
  notifications: NotificationItem[];
}

export const DashboardNotifications = ({ title = "Notifications", viewAllLink, notifications }: DashboardNotificationsProps) => (
  <Card className="p-6 md:p-8 rounded-2xl border-gray-200  shadow-sm bg-white">
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
      {notifications.map((notif) => (
        <div key={notif.id} className="flex gap-4 p-4 bg-[#FAFAFA] border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="bg-[#1C1C1E] p-2.5 rounded-lg flex items-center justify-center shrink-0 h-10 w-10">
            {notif.icon}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium text-gray-900">{notif.title}</span>
            <span className="text-[12px] text-gray-500">
              {notif.subtext1} {notif.subtext2 && <span className="text-gray-300 mx-1">|</span>} {notif.subtext2}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// --- KPI CARD ---
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