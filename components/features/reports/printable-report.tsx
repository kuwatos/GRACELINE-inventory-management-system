"use client";

import { forwardRef } from "react";
import { ReportRecord } from "./reports-history-table";

export const PrintableReport = forwardRef<HTMLDivElement, { reportData: ReportRecord | null }>(
  ({ reportData }, ref) => {
    if (!reportData) return null;

    return (
      <div className="hidden">
        <div ref={ref} className="print:block print:p-12 font-sans text-black [-webkit-print-color-adjust:exact]">
          <div className="border-b-4 border-black pb-4 mb-8">
            <h1 className="text-4xl font-black uppercase">{reportData.type} Report</h1>
            <p className="text-sm font-bold mt-2">Generated on {reportData.dateGenerated} by {reportData.generatedBy}</p>
          </div>

          <table className="w-full text-xs border-2 border-black border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-3 text-left">SUPPLIER</th>
                <th className="p-3 text-right">TOTAL PLACED</th>
                <th className="p-3 text-right">TOTAL PAID</th>
                <th className="p-3 text-center">INCOMING</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="p-3 font-bold">SAMPLE SUPPLIER LTD.</td>
                <td className="p-3 text-right">₱50,000.00</td>
                <td className="p-3 text-right">₱25,000.00</td>
                <td className="p-3 text-center">50 Units</td>
                <td className="p-3 text-right font-black">PARTIAL</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-20 border-t-2 border-gray-300 pt-4 flex justify-between text-[10px] font-bold text-gray-400">
            <span>GRACELINE INVENTORY MANAGEMENT SYSTEM</span>
            <span>CONFIDENTIAL DOCUMENT</span>
          </div>
        </div>
      </div>
    );
  }
);
PrintableReport.displayName = "PrintableReport";