"use client";

import { useState, useRef, useTransition, useEffect } from "react"; // 1. Added useEffect
import { useReactToPrint } from "react-to-print";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ReportsHistoryTable, Report } from "./reports-history-table";
import { ReportViewerModal } from "./report-viewer-modal";
import { PrintableReport } from "./printable-report";
import { deleteReportAction, generateReportAction, getMonthlyReportAction } from "@/lib/action/report.action";
import { cn } from "@/lib/utils";

interface ReportsManagerProps {
  data: Report[];
}

export const ReportsManager = ({ data=[] }: ReportsManagerProps) => {
  const [reports, setReports] = useState<Report[]>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false); // 2. Added Printing Flag
  
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `GraceLine-MonthEnd-${selectedReport?.dateCreated || "Report"}`,
  });

  const [auditData, setAuditData] = useState<any>(null);

  // 3. Logic to trigger print ONLY when data is confirmed loaded
  useEffect(() => {
    if (isReadyToPrint && selectedReport && auditData) {
      handlePrint();
      setIsReadyToPrint(false); // Reset flag after printing
    }
  }, [isReadyToPrint, selectedReport, auditData, handlePrint]);

  const handleGenerateClick = async () => {
    if (!startDate || !endDate) return;
    setIsGenerating(true);
    
    const res = await getMonthlyReportAction(startDate, endDate);
  
    if (res.success) {
      setAuditData(res.data);
      const newReportRecord = { 
        reportId: Date.now(),
        reportType: "Live Generated Audit",
        dateCreated: new Date(),
        dateStart: new Date(startDate),
        dateEnd: new Date(endDate)
      };
      setSelectedReport(newReportRecord);
      
      const result = await generateReportAction({
        reportType: "Live Generated Audit",
        dateStart: startDate,
        dateEnd: endDate
      });

      if (result.success) {
        setReports((prev) => [newReportRecord, ...prev]); 
      }
      setIsViewerOpen(true);
    }
    setIsGenerating(false);
  };

  const handleViewReport = async (report: Report) => {
    setIsGenerating(true);
    const res = await getMonthlyReportAction(
      new Date(report.dateStart).toISOString(), 
      new Date(report.dateEnd).toISOString()
    );

    if (res.success) {
      setAuditData(res.data);
      setSelectedReport(report);
      setIsViewerOpen(true);
    }
    setIsGenerating(false);
  };

  // 4. New handler for the Download button in the table
  const handleDownloadReport = async (report: Report) => {
    setIsGenerating(true);
    const res = await getMonthlyReportAction(
      new Date(report.dateStart).toISOString(), 
      new Date(report.dateEnd).toISOString()
    );

    if (res.success) {
      setAuditData(res.data);
      setSelectedReport(report);
      setIsReadyToPrint(true); // Trigger the useEffect
    }
    setIsGenerating(false);
  };

  const handleDeleteReport = async (report: Report) => {
    const result = await deleteReportAction(report.reportId);
    if (result.success) {
      setReports((prev) => prev.filter(r => r.reportId !== report.reportId));
    }
  }

  const isInvalidDateRange = 
    startDate !== "" && 
    endDate !== "" && 
    new Date(endDate) < new Date(startDate);

  const filteredData = reports.filter((r) => 
    r.dateCreated?.toLocaleString().includes(searchQuery) || r.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Month-End Report</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Start Date
            </Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 rounded-xl border-gray-200 shadow-sm focus:ring-black/5" />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3 h-3" /> End Date
            </Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 rounded-xl border-gray-200 shadow-sm focus:ring-black/5" />
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating || !startDate || !endDate || isInvalidDateRange} 
          className={cn(
            "w-full md:w-auto h-12 rounded-xl font-bold px-10 transition-all active:scale-95",
            isInvalidDateRange ? "bg-red-100 text-red-600 cursor-not-allowed" : "bg-black text-white hover:bg-black/90"
          )}
        >
          {isInvalidDateRange ? "Invalid Date Range" : "Generate Report"}
        </Button>
      </Card>

      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl min-h-[400px]">
        <div className="flex justify-end mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search history..." 
              className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5" />
          </div>
        </div>

        <ReportsHistoryTable 
          data={filteredData} 
          onView={handleViewReport} 
          onDownload={handleDownloadReport} // 5. Use the new robust handler
          onDelete={handleDeleteReport} 
        />
      </Card>

      <ReportViewerModal isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} reportData={selectedReport} auditResults={auditData} />
      
      {/* 6. Hidden print component */}
      <div className="hidden">
        <PrintableReport ref={printRef} reportData={selectedReport} auditData={auditData} />
      </div>
    </div>
  );
};