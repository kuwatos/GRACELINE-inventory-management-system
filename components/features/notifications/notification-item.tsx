import { Package, Truck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  type: 'alert' | 'order' | 'delivery';
  title: string;
  description: string;
  timeLabel: string;
  isFullPage?: boolean;
}

const icons = {
  alert: <AlertTriangle className="h-5 w-5 text-white" />,
  order: <Package className="h-5 w-5 text-white" />,
  delivery: <Truck className="h-5 w-5 text-white" />,
};

export function NotificationItem({ type, title, description, timeLabel, isFullPage }: NotificationProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-5 border border-slate-100 rounded-xl bg-white shadow-sm transition-all hover:border-slate-300",
      isFullPage ? "px-6 py-5" : "p-4"
    )}>
      <div className="flex items-start gap-4">
        {/* Icon Container - match your black rounded box style */}
        <div className="p-2.5 rounded-lg shrink-0 bg-slate-900 flex items-center justify-center">
          {icons[type]}
        </div>
        
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-[15px] text-slate-900 leading-tight">
            {title}
          </h4>
          <p className="text-sm text-slate-500">
            {description}
          </p>
          <span className="text-xs text-slate-400 mt-1">
            {timeLabel}
          </span>
        </div>
      </div>
      
      {/* The check-mark action button seen in your second screenshot */}
      <button 
        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Mark as read"
      >
        <CheckCircle2 className="h-6 w-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}