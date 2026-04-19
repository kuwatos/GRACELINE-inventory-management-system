"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderRecord } from "./order-history-table";
import { PrintOrder } from "./print-order";

interface DownloadOrderButtonProps {
  order: OrderRecord;
  variant?: "icon" | "full";
}

export const DownloadOrderButton = ({ order, variant = "icon" }: DownloadOrderButtonProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `PO-${order.poId}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return (
    <>
      {/* Hidden printable content — not visible on screen */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintOrder order={order} />
        </div>
      </div>

      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
          onClick={() => handlePrint()}
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => handlePrint()}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      )}
    </>
  );
};