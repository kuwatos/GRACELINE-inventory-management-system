import { Bell, Package, Truck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  type: 'alert' | 'order' | 'delivery';
  title: string;
  description: string;
  timeLabel: string;
}

const icons = {
  alert: <AlertTriangle className="h-5 w-5 text-white" />,
  order: <Package className="h-5 w-5 text-white" />,
  delivery: <Truck className="h-5 w-5 text-white" />,
};

const bgColors = {
  alert: "bg-black",
  order: "bg-slate-700",
  delivery: "bg-black",
};

export function NotificationItem({ type, title, description, timeLabel }: NotificationProps) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white mb-3 last:mb-0 shadow-sm">
      <div className={cn("p-2 rounded-md shrink-0", bgColors[type])}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        <span className="text-[10px] text-slate-400 mt-2 block">{timeLabel}</span>
      </div>
    </div>
  );
}