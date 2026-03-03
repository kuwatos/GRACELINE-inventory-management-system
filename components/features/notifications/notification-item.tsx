"use client";

import { Package, Truck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  id: string; // Added ID
  type: 'alert' | 'order' | 'delivery';
  title: string;
  description: string;
  timeLabel: string;
  isFullPage?: boolean;
  onMarkAsRead?: (id: string) => void; // Added click handler
}

const icons = {
  alert: <AlertTriangle className="h-5 w-5 text-white" />,
  order: <Package className="h-5 w-5 text-white" />,
  delivery: <Truck className="h-5 w-5 text-white" />,
};

export function NotificationItem({ id, type, title, description, timeLabel, isFullPage, onMarkAsRead }: NotificationProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-md",
      isFullPage ? "px-6 py-5" : "p-4"
    )}>
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className="p-2.5 rounded-xl shrink-0 bg-[#0f172a] flex items-center justify-center shadow-sm">
          {icons[type]}
        </div>
        
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-[15px] text-gray-900 leading-tight">
            {title}
          </h4>
          <p className="text-sm font-medium text-gray-500">
            {description}
          </p>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
            {timeLabel}
          </span>
        </div>
      </div>
      
      {/* Action button now actually fires the function! */}
      <button 
        onClick={() => onMarkAsRead && onMarkAsRead(id)}
        className="p-2 text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all active:scale-95"
        aria-label="Mark as read"
      >
        <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  );
}