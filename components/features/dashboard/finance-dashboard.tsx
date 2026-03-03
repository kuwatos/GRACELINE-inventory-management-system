"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Search, ChevronDown, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DashboardNotifications, NotificationItem } from "./dashboard-shared";
import { ReportsHistoryTable, ReportRecord } from "../reports/reports-history-table";
import { ReportViewerModal } from "../reports/report-viewer-modal";
import { PrintableReport } from "../reports/printable-report";

interface FinanceDashboardProps {
  notifications?: NotificationItem[];
  reports?: ReportRecord[];
  isLoading?: boolean;
}

// Mock Data matching your Finance screenshot
const MOCK_FINANCE_NOTIFS = [
  { id: "1", title: "Delivery Completed: Supplier GlobalParts Ltd", subtext1: "Confirmation Date: November 5, 2025", icon: <FileText className="w-5 h-5 text-white" /> },
  { id: "2", title: "Delivery Completed: Supplier GlobalParts Ltd", subtext1: "Confirmation Date: October 27, 2025", icon: <FileText className="w-5 h-5 text-white" /> },
  { id: "3", title: "Delivery Completed: Supplier GlobalParts Ltd", subtext1: "Confirmation Date: October 26, 2025", icon: <FileText className="w-5 h-5 text-white" /> },
];

const MOCK_RECENT_REPORTS: ReportRecord[] = [
  { id: "1", type: "Order Aggregate", dateGenerated: "2025-01-15", generatedBy: "Sarah Mitchell" },
  { id: "2", type: "Inventory Stock", dateGenerated: "2025-01-12", generatedBy: "Sarah Mitchell" },
  { id: "3", type: "Order Aggregate", dateGenerated: "2025-01-10", generatedBy: "Sarah Mitchell" },
];

export const FinanceDashboard = ({ 
  notifications = MOCK_FINANCE_NOTIFS, 
  reports = MOCK_RECENT_REPORTS,
  isLoading = false 
}: FinanceDashboardProps) => {
  
  // Table & Viewer State
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);

  // Print configuration (so Finance can still download PDFs straight from the dashboard!)
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedReport ? `${selectedReport.type}-Report` : "GraceLine-Report",
  });

  const filteredData = reports.filter((report) => 
    report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.generatedBy.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDelete = (id: string) => {
    console.log("Delete report triggered from dashboard:", id);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top: Notifications Panel */}
      <DashboardNotifications 
        title="Notifications" 
        viewAllLink="/finance/notifications" 
        notifications={notifications} 
      />

      {/* Bottom: Recent Reports Table */}
      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 w-full">
          <h2 className="text-lg font-medium text-gray-900 w-full md:w-auto">Recent Reports</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a report..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
              />
            </div>
            <div className="relative w-full md:w-auto shrink-0">
              <select className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-bold pr-10 focus:outline-none cursor-pointer w-full text-gray-700">
                <option>Search Filters</option>
                <option>My Reports</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reusing the exact same table from the Reports tab */}
        <ReportsHistoryTable 
          data={filteredData} 
          onView={handleView} 
          onDownload={handleDownloadClick} 
          onDelete={handleDelete} 
        />
      </Card>

      {/* We still include these so the View and Download buttons actually work! */}
      <ReportViewerModal 
        isOpen={isViewerOpen} 
        onClose={() => { setIsViewerOpen(false); setSelectedReport(null); }} 
        reportData={selectedReport} 
      />
      <PrintableReport ref={printRef} reportData={selectedReport} />
      
    </div>
  );
};