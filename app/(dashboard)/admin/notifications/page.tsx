import { NotificationManager } from '@/components/features/notifications/notification-manager'
import { validateSessionUser } from '@/src/entity/user/user.repository'
import { readUserNotifications } from '@/src/entity/user_notifications/user_notifications.query'
import React from 'react'

async function page() {
  const user = await validateSessionUser()
  const userNotifs = await readUserNotifications(user.id)

  return (
    <NotificationManager
    data = {userNotifs}
    />
  )
}

export default page