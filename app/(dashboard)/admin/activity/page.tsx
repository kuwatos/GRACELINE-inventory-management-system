import { ActivityLogManager } from '@/components/features/activity/activity-log-manager'
import React from 'react'
import {readLogsWithUser} from '@/src/entity/log/log.query'

async function page() {
  const logs = await readLogsWithUser();
  return (
    <ActivityLogManager data={logs}/>
  )
}

export default page