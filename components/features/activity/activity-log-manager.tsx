"use client";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLogTable } from "./activity-log-table";

export const ActivityLogManager = () => {
  return (
    <Card className="shadow-sm border-gray-200 p-8">
      <CardContent className="p-0 space-y-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-800">Log History Table</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-11 h-11 border-gray-200 focus-visible:ring-black"
              />
            </div>

            <Button 
              variant="secondary" 
              className="bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 h-11 px-5 gap-2"
            >
              Filter By
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ActivityLogTable />
      </CardContent>
    </Card>
  );
};