import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationItem } from "./dash-notification-item";
import { AlertCircle } from "lucide-react";

export function NotificationCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <CardTitle className="text-base font-bold">Notifications</CardTitle>
        </div>
        <button className="text-xs font-medium text-slate-600 hover:underline">
          View All Notifications →
        </button>
      </CardHeader>
      <CardContent>
        <NotificationItem 
          type="alert"
          title="Low Stock Alert: Industrial Valve Model A-342"
          description="Current quantity: 5 units | Reorder level: 20 units"
          timeLabel="2 hours ago"
        />
        <NotificationItem 
          type="order"
          title="Order Placed: PO#2025-0847"
          description="Delivery Date: November 20, 2025 | Supplier: TechSupply Co."
          timeLabel="5 hours ago"
        />
        <NotificationItem 
          type="delivery"
          title="Delivery Received: Supplier GlobalParts Ltd"
          description="Date Delivered: November 5, 2025"
          timeLabel="Date Delivered: November 5, 2025"
        />
      </CardContent>
    </Card>
  );
}