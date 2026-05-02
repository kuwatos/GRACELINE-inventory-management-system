// /components/ui/loading-overlay.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoadingOverlay = ({ 
  isLoading, 
  message = "Processing...",
  className 
}: { 
  isLoading: boolean; 
  message?: string;
  className?: string;
}) => {
  if (!isLoading) return null;
  return (
    <div
      className={cn("absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-[inherit]", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
        <Loader2 className="w-5 h-5 animate-spin text-gray-700 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">{message}</span>
      </div>
    </div>
  );
};