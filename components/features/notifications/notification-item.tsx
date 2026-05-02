"use client";

import { Package, Truck, BellDot, CheckCircle2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  userNotifId: number; // Added ID
  description: string;
  createdAt: string | Date | null ;
  targetId: number|null; // Optional targetId for potential future use
  additionalDescription: string; // specific description for this notification instance
  isFullPage?: boolean;
  onMarkAsRead?: (id: number) => void; // Added click handler
}

const icons = {
  alert: <BellDot className="h-5 w-5 text-white" />,
  order: <Package className="h-5 w-5 text-white" />,
  delivery: <Truck className="h-5 w-5 text-white" />,
};

export function NotificationItem({ userNotifId, description, createdAt,targetId, additionalDescription, isFullPage, onMarkAsRead }: NotificationProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-md",
      isFullPage ? "px-6 py-5" : "p-4"
    )}>
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className="p-2.5 rounded-xl shrink-0 bg-red-400 flex items-center justify-center shadow-sm">
          {icons.alert}
        </div>
        
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-[15px] text-gray-900 leading-tight">
            {description}
          </h4>
          {/* ✅ ONLY render the badge if targetId exists */}
            {targetId !== null && targetId !== 0 && (
              <span className="flex items-center gap-0.5 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                <Hash className="w-2.5 h-2.5" />
                {targetId} - {additionalDescription}
              </span>
            )}
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
            {createdAt ? (
              new Date(createdAt).toLocaleString()
            ) : (
              "-"
            )}
          </span>
        </div>
      </div>
      
      {/* Action button now actually fires the function! */}
      <button 
        onClick={() => onMarkAsRead && onMarkAsRead(userNotifId)}
        className="p-2 text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all active:scale-95"
        aria-label="Mark as read"
      >
        <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  );
}

