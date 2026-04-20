"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import {updateUserNotificationAction, markAllNotificationsAsReadAction} from "@/lib/action/user_notification.action";

export interface Notification {
  userNotifId: number;
  description: string;
  createdAt: string | Date | null; // Match the Item props
  targetId: number|null; // Optional targetId for potential future use
  additionalDescription: string; // specific description for this notification instance
}

interface NotificationManagerProps {
  data: Notification[];
  isLoading?: boolean; // 1. Added loading state for initial DB fetch
  onMarkAsRead?: (userNotifId: number) => Promise<void> | void; // 2. Now supports async DB calls
  onMarkAllAsRead?: () => Promise<void> | void;
}

const EMPTY_NOTIFICATIONS: Notification[] = [];

export const NotificationManager = ({ 
  data = EMPTY_NOTIFICATIONS, 
  isLoading = false,
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationManagerProps) => {
  
  const [notifications, setNotifications] = useState<Notification[]>(data);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const handleMarkAsRead = async (id: number) => {
    // Save a backup of the current state in case the database fails
    const previousNotifications = [...notifications];
    
    // 1. Optimistic UI: Instantly hide it from the screen
    setNotifications(prev => prev.filter(notif => notif.userNotifId !== id));
    await updateUserNotificationAction (id);
    
  };

  const handleMarkAllAsRead = async () => {
    const previousNotifications = [...notifications];
    setNotifications([]);
    
    await markAllNotificationsAsReadAction()
  };

  return (
    <div className="space-y-6">
      <div className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">System Notifications</h2>
            <p className="text-sm font-medium text-gray-500">Manage your inventory alerts and order updates.</p>
          </div>
          
          {notifications.length > 0 && !isLoading && (
            <Button 
              onClick={handleMarkAllAsRead}
              variant="outline" 
              className="h-11 rounded-xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50 gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="shadow-sm border-gray-200 rounded-2xl overflow-hidden p-6 bg-gray-50/30">
          <div className="space-y-3">
            {isLoading ? (
              // The Loading State (Prevents flashing "All caught up" while fetching)
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              // The Data State
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.userNotifId}
                  userNotifId={notif.userNotifId}
                  description={notif.description}
                  createdAt={notif.createdAt}
                  targetId={notif.targetId}
                  additionalDescription={notif.additionalDescription}
                  isFullPage={true}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              // The Empty State
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">All caught up!</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">You don&apos;t have any new notifications at the moment.</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};