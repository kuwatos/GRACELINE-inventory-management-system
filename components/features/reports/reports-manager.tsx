"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Search, Loader2, FileText, Plus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ReportsHistoryTable, ReportRecord } from "./reports-history-table";
import { ReportViewerModal } from "./report-viewer-modal";
import { PrintableReport } from "./printable-report";

export const ReportsManager = () => {
  const [reports, setReports] = useState<ReportRecord[]>([
    { reportId: 1, reportType: "Month-End Report", dateGenerated: new Date("2026-03-31"), generatedBy: "John Carlo", startDate: new Date("2026-03-01"), endDate: new Date("2026-03-31") },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `GraceLine-MonthEnd-${selectedReport?.dateGenerated || "Report"}`,
  });

  const handleGenerateClick = () => {
    if (!startDate || !endDate) return;
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const newReport: ReportRecord = {
        reportId: 232323, // Random ID for demo
        reportType: "Month-End Report",
        dateGenerated: new Date(),
        generatedBy: "John Carlo",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setStartDate("");
      setEndDate("");
    }, 1000);
  };

  const filteredData = reports.filter((r) => 
    r.dateGenerated?.toLocaleString().includes(searchQuery) || r.generatedBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-black p-2 rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Month-End Report</h2>
            <p className="text-xs text-gray-400 font-medium tracking-tight">Full Supplier Audit & Inventory Movement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Start Date
            </Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 rounded-xl border-gray-200 shadow-sm" />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> End Date
            </Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 rounded-xl border-gray-200 shadow-sm" />
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating || !startDate || !endDate} 
          className="w-full md:w-auto bg-black text-white hover:bg-zinc-800 h-12 rounded-xl font-bold px-10 transition-all active:scale-95 shadow-lg shadow-gray-200"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Generate Report
        </Button>
      </Card>

      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl min-h-[400px]">
        <div className="flex justify-end mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search history..." className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black" />
          </div>
        </div>

        <ReportsHistoryTable 
          data={filteredData} 
          onView={(r: any) => { setSelectedReport(r); setIsViewerOpen(true); }} 
          onDownload={(r: any) => { setSelectedReport(r); setTimeout(() => handlePrint(), 100); }} 
          onDelete={async (id: number) => setReports(reports.filter(r => r.reportId !== id))} 
        />
      </Card>

      <ReportViewerModal isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} reportData={selectedReport} />
      <PrintableReport ref={printRef} reportData={selectedReport} />
    </div>
  );
};