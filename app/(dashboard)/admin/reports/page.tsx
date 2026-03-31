import { ReportsManager } from '@/components/features/reports/reports-manager'
import React from 'react'
import { readReportHistory } from '@/src/entity/reports/reports.query';
  
async function page() {
  const reportHistory = await readReportHistory();
  return (
    <ReportsManager data={reportHistory} />
  )
}

export default page