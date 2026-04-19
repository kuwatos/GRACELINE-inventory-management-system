"use server";

import { createReport, deleteReport } from "@/src/entity/reports/reports.repository";
import { generateMonthlyAudit } from "@/src/entity/reports/reports.query";
import { baseReportSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { validateSessionUser } from "@/src/entity/user/user.repository";

export async function generateReportAction(values: z.input<typeof baseReportSchema>) {
  try {
    // 2. Validate and Coerce strings to Dates
    const validated = baseReportSchema.parse(values);
    // Adjust dates to Manila Timezone (+08:00) 
    // This ensures the "Saved" report reflects the correct local boundaries
    const manilaStart = new Date(`${values.dateStart}T00:00:00+08:00`);
    const manilaEnd = new Date(`${values.dateEnd}T23:59:59+08:00`);

    // 3. Call the Repository
    await createReport({
      reportType: validated.reportType,
      dateStart: manilaStart,
      dateEnd: manilaEnd,
    });

    // 4. Refresh the history table
    revalidatePath("/reports");
    return { success: true };
    
  } catch (error) {
    console.error("Report Action Error:", error);
    return { success: false, error: "Failed to generate report." };
  }
}

export async function deleteReportAction(reportId: number) {
  try {
    // Tell the Robot Butler to deactivate this user
    await deleteReport(reportId);

    // Refresh the page so they disappear from the table instantly
    revalidatePath("/reports");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete report:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function getMonthlyReportAction(startDate: any, endDate: any) {
  try {
    // 1. Force the input to be a YYYY-MM-DD string
    const toDateString = (val: any) => {
      if (val instanceof Date) return val.toISOString().split('T')[0];
      if (typeof val === 'string' && val.includes('T')) return val.split('T')[0];
      return val; // Hopefully already YYYY-MM-DD
    };

    const cleanStart = toDateString(startDate);
    const cleanEnd = toDateString(endDate);

    const startWithOffset = new Date(`${cleanStart}T00:00:00+08:00`);
    const endWithOffset = new Date(`${cleanEnd}T23:59:59+08:00`);

    const rawData = await generateMonthlyAudit(startWithOffset, endWithOffset);
    
    // 2. IMPORTANT: Server Actions cannot return raw Date objects. 
    // We must serialize them to strings before returning to the client.
    return { success: true, data: JSON.parse(JSON.stringify(rawData)) };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate audit." };
  }
}