"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportsHistoryTable, ReportRecord } from "./reports-history-table";
import { ReportViewerModal } from "./report-viewer-modal";
import { PrintableReport } from "./printable-report";
import { deleteReportAction, generateReportAction } from "@/lib/action/report.action";

// 1. Safe empty array to prevent React infinite loops (just like Notifications!)
const EMPTY_REPORTS: ReportRecord[] = [];

// 2. Database-ready interface
interface ReportsManagerProps {
  data: ReportRecord[];
  isLoading?: boolean;
  onGenerateReport?: (params: { type: string; startDate: string; endDate: string }) => Promise<void>;
  onDeleteReport?: (id: number) => Promise<void>;
}

export const ReportsManager = ({ 
  data = EMPTY_REPORTS, 
  isLoading = false,
  onGenerateReport,
  onDeleteReport
}: ReportsManagerProps) => {
  
  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  
  // Form State (for generating new reports)
  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Print configuration
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedReport ? `${selectedReport.reportType}-Report` : "GraceLine-Report",
  });

  const filteredData = data.filter((report) => 
    report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.generatedBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (report: ReportRecord) => {
    setSelectedReport(report);
    setIsViewerOpen(true);
  };

  const handleDownloadClick = (report: ReportRecord) => {
    setSelectedReport(report);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // 3. The actual Async Generate Handler
  const handleGenerateClick = async () => {
    if (!reportType || !startDate || !endDate || !onGenerateReport) return;
    
    setIsGenerating(true);

    try {
      // 3. Call the Server Action
      // Note: We use 'reportType' to match your baseReportSchema keys
      const result = await generateReportAction({ 
        reportType: reportType, 
        startDate: startDate, 
        endDate: endDate 
      });

      if (result.success) {
        // 4. Reset the form on success
        setReportType("");
        setStartDate("");
        setEndDate("");
        // Optional: toast.success("Report generated!")
      } else {
        // 5. Handle potential business logic errors
        alert(result.error || "Failed to generate report. Please try again.");
      }
    } catch (error) {
      // 6. Handle network or unexpected errors
      console.error("Critical error in report generation:", error);
    } finally {
      // 7. Always turn off the loader
      setIsGenerating(false);
    }

  };

  // 4. The actual Async Delete Handler
  const handleDeleteClick = async (id: number) => {
    try {
      const result = await deleteReportAction(id);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Generate New Report Section */}
      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Generate a New Report</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-11 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 text-gray-600 font-medium">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Order Aggregate">Order Aggregate</SelectItem>
                <SelectItem value="Inventory Stock">Inventory Stock</SelectItem>
                <SelectItem value="Supplier Performance">Supplier Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Start Date</Label>
            <div className="relative">
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 text-gray-600 font-medium" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">End Date</Label>
            <div className="relative">
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 text-gray-600 font-medium" 
              />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateClick}
          disabled={!reportType || !startDate || !endDate || isGenerating}
          className="bg-[#0f172a] text-white hover:bg-[#0f172a]/80 h-11 rounded-xl font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 w-fit flex"
        >
          {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </Card>

      {/* Report History Section */}
      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl min-h-[400px]">
        <div className="flex flex-col md:flex-row justify-end items-center gap-3 mb-6 w-full">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a report..." 
              className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <select className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-bold pr-10 focus:outline-none cursor-pointer w-full text-gray-700">
              <option>Search Filters</option>
              <option>My Reports</option>
              <option>Last 30 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Loading State for the Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Loading historical reports...</p>
          </div>
        ) : (
          <ReportsHistoryTable 
            data={filteredData} 
            onView={handleView} 
            onDownload={handleDownloadClick} 
            onDelete={handleDeleteClick} 
          />
        )}
      </Card>

      {/* The Viewer Modal */}
      <ReportViewerModal 
        isOpen={isViewerOpen} 
        onClose={() => { setIsViewerOpen(false); setSelectedReport(null); }} 
        reportData={selectedReport} 
      />

      {/* The Hidden Printable Layout */}
      <PrintableReport ref={printRef} reportData={selectedReport} />
    </div>
  );
};