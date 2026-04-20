import { NotificationManager } from '@/components/features/notifications/notification-manager'
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query'
import React from 'react'


async function page() {
  const notifications = await readUserNotifications();

  return (
    <NotificationManager data={notifications} />
  )
}

export default page