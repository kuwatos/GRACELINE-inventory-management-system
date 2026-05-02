"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ActivityLogTable, Log } from "./activity-log-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLogManagerProps {
  data?: Log[];
}

export const ActivityLogManager = ({ data = [] }: ActivityLogManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  // 1. New state to track the dropdown selection
  const [filterAction, setFilterAction] = useState("all");

  // 2. Updated filter logic combining search AND dropdown
  const filteredData = data.filter((log) => {
    // Check search query
    const searchLower = searchQuery.toLowerCase();
    const user = (log.user ?? "").toLowerCase();
    const action = (log.action ?? "").toLowerCase();
    const dept = (log.dept ?? "").toLowerCase();
    const target = (log.target ?? "").toString().toLowerCase();

    const matchesSearch =
      user.includes(searchLower) ||
      action.includes(searchLower) ||
      dept.includes(searchLower) ||
      target.includes(searchLower);

    // Check dropdown filter
    const matchesFilter = filterAction === "all" || log.action === filterAction;

    // A row must pass both the search bar AND the dropdown filter to be shown
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">Log History</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs by user, action..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5"
              />
            </div>
            
            {/* 3. Hooked up the state and corrected the SelectItem values */}
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="!h-11 w-40 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:shadow-md hover:text-slate-900 transition-all">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              
              <SelectContent 
                position="popper" 
                sideOffset={5} 
                className="rounded-xl border-slate-200 shadow-lg bg-white p-1"
              >
                <SelectItem 
                  value="all" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  All Actions
                </SelectItem>
                <SelectItem 
                  value="Updated Stock" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Updated Stock
                </SelectItem>
                <SelectItem 
                  value="Created Order" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Created Order
                </SelectItem>
                <SelectItem 
                  value="Added User" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Added User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ActivityLogTable data={filteredData} />
      </Card>
    </div>
  );
};