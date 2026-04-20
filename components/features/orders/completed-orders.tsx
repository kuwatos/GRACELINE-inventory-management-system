"use client";

import { useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { updateUserNotificationAction } from "@/lib/action/user_notification.action";

interface NotificationProps {
  userNotifId: number;
  description: string;
  createdAt: string | Date | null;
  targetId: number | null;
  additionalDescription: string;
  isFullPage?: boolean;
}

export const CompletedOrders = ({ data = [] }: { data: NotificationProps[] }) => {
  // Initialize state with props. 
  // Because of the 'key' in page.tsx, this resets automatically when data changes.
  const [orders, setOrders] = useState<NotificationProps[]>(data);

  const handleArchive = async (id: number) => {
    const previousOrders = [...orders];
    
    // 1. Optimistic UI: Remove it immediately
    setOrders((current) => current.filter((o) => o.userNotifId !== id));

    try {
      // 2. Call the server action
      await updateUserNotificationAction(id);
    } catch (error) {
      console.error("Database sync failed:", error);
      setOrders(previousOrders); // Rollback on failure
    }
  };

  return (
    <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 text-left">Completed Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed bg-gray-50/30">
          All completed orders have been archived.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div 
              key={order.userNotifId} 
              className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-gray-100 rounded-xl transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#1C1C1E] p-2.5 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">
                    {order.description}: {order.additionalDescription}
                  </span>
                  <span className="text-[13px] text-gray-500">
                    Confirmed: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>

              <div className="pl-4">
                <button 
                  onClick={() => handleArchive(order.userNotifId)}
                  className="p-1 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors active:scale-95"
                  aria-label="Archive order"
                >
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};