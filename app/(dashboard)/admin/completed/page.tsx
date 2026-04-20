// app/(dashboard)/admin/completed/page.tsx
import { CompletedOrders } from '@/components/features/orders/completed-orders'
import { readCompletedOrderNotifications } from '@/src/entity/user_notifications/user_notifications.query'

async function Page() {
  // 1. Fetch the data on the server
  const notifications = await readCompletedOrderNotifications();

  return (
    // 2. Pass the data to the 'data' prop
    // 3. Use 'key' to prevent the "Maximum update depth" crash by resetting state on change
    <CompletedOrders 
      key={notifications.length + (notifications[0]?.userNotifId || 0)} 
      data={notifications} 
    />
  )
}

export default Page;