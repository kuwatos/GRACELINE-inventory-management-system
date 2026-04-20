"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const NavigationLoaderContext = createContext({
  startLoading: () => {},
  stopLoading: () => {},
});

export const useNavigationLoader = () => useContext(NavigationLoaderContext);

export const NavigationLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  return (
    <NavigationLoaderContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
            <Loader2 className="w-5 h-5 animate-spin text-gray-700 shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </NavigationLoaderContext.Provider>
  );
};