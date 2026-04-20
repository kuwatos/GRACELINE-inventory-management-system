"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderRecord } from "./order-history-table";
import { PrintOrder } from "./print-order";
import { toast } from "sonner";

interface DownloadOrderButtonProps {
  order: OrderRecord;
  variant?: "icon" | "full";
}

export const DownloadOrderButton = ({ order, variant = "icon" }: DownloadOrderButtonProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `PO-${order.poId}`,
    onBeforePrint: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast.info("If you clicked Save, check the folder you specified. If Cancelled, no PDF was downloaded.");
    },
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
      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintOrder order={order} />
        </div>
      </div>

      {variant === "icon" ? (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => handlePrint()}
            disabled={isPrinting}
            title="Download PDF"
          >
            {isPrinting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Download className="w-4 h-4" />
            }
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => handlePrint()}
            disabled={isPrinting}
            className="gap-2"
          >
            {isPrinting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Download className="w-4 h-4" />
            }
            {isPrinting ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      )}
    </>
  );
};