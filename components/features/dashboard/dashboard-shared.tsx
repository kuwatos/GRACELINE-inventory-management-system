"use client";

import { ArrowRight, BellDot, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Notification } from "../notifications/notification-manager";

interface DashboardNotificationsProps {
  title?: string;
  viewAllLink: string;
  notifications: Notification[];
}
  
export const DashboardNotifications = ({ title = "Notifications", viewAllLink, notifications }: DashboardNotificationsProps) => (
  <Card className="p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 bg-white">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <Link href={viewAllLink} className="text-sm font-bold text-gray-400 hover:text-[#0f172a] flex items-center gap-1 transition-colors">
        View All Notifications <ArrowRight className="w-4 h-4" />
      </Link>
    </div>

    <div className="space-y-3">
      {notifications.slice(0, 3).map((notif) => (
        <div
          key={notif.userNotifId}
          className="group flex items-start gap-4 p-5 rounded-2xl border border-gray-50 bg-white shadow-sm hover:bg-[#0f172a] transition-all cursor-default"
        >
          <div className="p-2.5 rounded-xl shrink-0 bg-red-400 flex items-center justify-center shadow-sm">
            <BellDot className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <h4 className="font-bold text-[15px] text-gray-900 group-hover:text-white leading-tight transition-colors">
              {notif.description}
            </h4>
            
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {notif.targetId !== null && notif.targetId !== 0 && (
                <span className="flex items-center gap-0.5 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold w-fit group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <Hash className="w-2.5 h-2.5" />
                  {notif.targetId + " " + notif.additionalDescription}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-400/80 transition-colors">
                {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <p className="text-sm font-medium text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
          No new notifications.
        </p>
      )}
    </div>
  </Card>
);

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext1: string;
  subtext2: string;
  icon?: React.ReactNode;
}

export const KpiCard = ({ title, value, subtext1, subtext2, icon }: KpiCardProps) => (
  <Card className="p-5 md:p-6 rounded-2xl border border-gray-100 bg-white shadow-sm w-full hover:shadow-md transition-all">
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-4xl font-black tracking-tighter text-gray-900">{value}</p>
    </div>
    
    <div className="border-t border-gray-100 pt-3 space-y-1">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtext1}</p>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtext2}</p>
    </div>
  </Card>
);