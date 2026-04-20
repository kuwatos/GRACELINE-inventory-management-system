"use client";

import { forwardRef } from "react";
import { Report } from "./reports-history-table";

interface PrintableReportProps {
  reportData: Report | null;
  auditData: {
    purchased: { supplierName: string; totalAmount: number }[];
    paid: { supplierName: string; paidAmount: number }[];
    incoming: { supplierName: string; productName: string; quantity: number; status: string; eta: Date | null }[];
    inventory: { productName: string; measurement: string; startQty: number; endQty: number }[];
  } | null;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ reportData, auditData }, ref) => {
    if (!reportData || !auditData) return null;

    // 1. Merge Financial Data (Liability vs Paid)
    const supplierNames = Array.from(new Set([
      ...auditData.purchased.map(p => p.supplierName),
      ...auditData.paid.map(p => p.supplierName)
    ]));

    const financialSummary = supplierNames.map(name => ({
      name,
      purchased: auditData.purchased.find(p => p.supplierName === name)?.totalAmount || 0,
      paid: auditData.paid.find(p => p.supplierName === name)?.paidAmount || 0,
    }));

    const formatCurrency = (val: number) => 
      new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

    return (
      <div className="hidden">
        <div ref={ref} className="print:block print:p-12 font-sans text-black [-webkit-print-color-adjust:exact]">
          
          {/* Header */}
          <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">GRACELINE AUDIT</h1>
              <p className="text-sm font-bold mt-1 uppercase tracking-widest text-gray-500">{reportData.reportType}</p>
            </div>
            <div className="text-right text-xs font-bold">
              <p>RANGE: {new Date(reportData.dateStart).toLocaleDateString()} - {new Date(reportData.dateEnd).toLocaleDateString()}</p>
              <p>PRINTED: {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* 1. Financial Table */}
          <div className="mb-10">
            <h2 className="text-sm font-black uppercase mb-4 bg-black text-white px-3 py-1 inline-block">I. Financial Summary</h2>
            <table className="w-full text-xs border-2 border-black border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                  <th className="p-3 text-left border-r border-black">SUPPLIER</th>
                  <th className="p-3 text-right border-r border-black">TOTAL PURCHASED</th>
                  <th className="p-3 text-right border-r border-black">TOTAL PAID</th>
                  <th className="p-3 text-right">BALANCE DUE</th>
                </tr>
              </thead>
              <tbody>
                {financialSummary.map((row, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="p-3 font-bold border-r border-black">{row.name}</td>
                    <td className="p-3 text-right border-r border-black">{formatCurrency(row.purchased)}</td>
                    <td className="p-3 text-right border-r border-black text-green-700 font-bold">{formatCurrency(row.paid)}</td>
                    <td className="p-3 text-right font-black text-red-600">
                      {formatCurrency(row.purchased - row.paid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Incoming Materials */}
          <div className="mb-10">
            <h2 className="text-sm font-black uppercase mb-4 bg-black text-white px-3 py-1 inline-block">II. Incoming Materials</h2>
            <table className="w-full text-xs border-2 border-black border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                  <th className="p-3 text-left border-r border-black">ITEM</th>
                  <th className="p-3 text-left border-r border-black">SUPPLIER</th>
                  <th className="p-3 text-center border-r border-black">QTY PENDING</th>
                  <th className="p-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {auditData.incoming.length > 0 ? auditData.incoming.map((item, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="p-3 font-bold border-r border-black">{item.productName}</td>
                    <td className="p-3 border-r border-black text-gray-600 italic">{item.supplierName}</td>
                    <td className="p-3 text-center border-r border-black font-black">{item.quantity}</td>
                    <td className="p-3 text-right uppercase font-bold text-[10px]">{item.status}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="p-6 text-center italic text-gray-400">No incoming materials found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. Inventory Movement */}
          <div>
            <h2 className="text-sm font-black uppercase mb-4 bg-black text-white px-3 py-1 inline-block">III. Stock Movement</h2>
            <table className="w-full text-[10px] border-2 border-black border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                  <th className="p-2 text-left border-r border-black">PRODUCT</th>
                  <th className="p-2 text-center border-r border-black">UNIT</th>
                  <th className="p-2 text-right border-r border-black">OPENING</th>
                  <th className="p-2 text-right border-r border-black">CLOSING</th>
                  <th className="p-2 text-right italic">VARIANCE</th>
                </tr>
              </thead>
              <tbody>
                {auditData.inventory.map((item, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="p-2 font-bold border-r border-black">{item.productName}</td>
                    <td className="p-2 text-center border-r border-black text-gray-500 uppercase">{item.measurement}</td>
                    <td className="p-2 text-right border-r border-black">{item.startQty}</td>
                    <td className="p-2 text-right border-r border-black font-bold">{item.endQty}</td>
                    <td className={`p-2 text-right font-bold ${item.endQty - item.startQty < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.endQty - item.startQty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-20 border-t-2 border-black pt-4 flex justify-between text-[10px] font-black text-gray-400">
            <span>GRACELINE INVENTORY MANAGEMENT SYSTEM</span>
            <span>SYSTEM-GENERATED AUDIT • DO NOT TAMPER</span>
          </div>
        </div>
      </div>
    );
  }
);

PrintableReport.displayName = "PrintableReport";