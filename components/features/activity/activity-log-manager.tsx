"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ActivityLogTable, Log } from "./activity-log-table";

interface ActivityLogManagerProps {
  data?: Log[];
}

export const ActivityLogManager = ({ data = [] }: ActivityLogManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic allowing search by User, Action, Dept, or Target ID
  const filteredData = data.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.user.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.dept.toLowerCase().includes(searchLower) ||
      log.target.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">Log History</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs by user, action..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer">
                <option value="">Filter by Action</option>
                <option value="Updated Stock">Updated Stock</option>
                <option value="Created Order">Created Order</option>
                <option value="Added User">Added User</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <ActivityLogTable data={filteredData} />
      </Card>
    </div>
  );
};