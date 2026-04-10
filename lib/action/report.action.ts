"use server";

import { auth } from "@/auth"; // Your auth import
import { createReport, deleteReport } from "@/src/entity/reports/reports.repository";
import { baseReportSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function generateReportAction(values: z.input<typeof baseReportSchema>) {
  try {
    // 1. Authenticate the user
    // const session = await auth();
    // if (!session?.user?.id) throw new Error("Unauthorized");

    // 2. Validate and Coerce strings to Dates
    const validated = baseReportSchema.parse(values);

    // 3. Call the Repository
    await createReport({
      userId: "user_001",
      reportType: validated.reportType,
      dateStart: validated.startDate,
      dateEnd: validated.endDate,
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