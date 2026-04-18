import { NotificationManager } from '@/components/features/notifications/notification-manager'
import React from 'react'
import {readUserNotifications} from '@/src/entity/user_notifications/user_notifications.query'


async function page() {
  const notifications = await readUserNotifications();

  return (
    <NotificationManager data={notifications} />
  )
}

export default page