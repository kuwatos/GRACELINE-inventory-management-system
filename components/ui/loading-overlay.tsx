import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({ isLoading, message = "Processing...", className }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        // position-wise: sits on top, takes no space in the flex flow
        "absolute inset-0 z-50",
        // visual
        "flex flex-col items-center justify-center",
        "bg-white/70 backdrop-blur-[2px]",
        // make sure it doesn't inherit rounded corners weirdly
        "rounded-[inherit]",
        className
      )}
      // Prevent any clicks from reaching the form below
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
        <Loader2 className="w-5 h-5 animate-spin text-gray-700 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">{message}</span>
      </div>
    </div>
  );
};