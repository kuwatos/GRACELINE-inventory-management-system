"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  itemAffected: string;
}

export const ActivityTable = () => {
  const activities: ActivityItem[] = [
    {
      timestamp: "Mar 13, 2025 14:32",
      user: { name: "John Davis", avatar: "/avatars/john.png" },
      action: "Updated Item Quantity",
      itemAffected: "Industrial Valve A-342 (+50 units)",
    },
    {
      timestamp: "Mar 13, 2025 13:18",
      user: { name: "Sarah Mitchell", avatar: "/avatars/sarah.png" },
      action: "Created Purchase Order",
      itemAffected: "PO#2025-0848 - GlobalParts Ltd",
    },
    {
      timestamp: "Mar 13, 2025 11:45",
      user: { name: "Emily Rodriguez", avatar: "/avatars/emily.png" },
      action: "Created Purchase Order",
      itemAffected: "PO#2025-0845 - TechSupply Co.",
    },
    {
      timestamp: "Mar 13, 2025 10:22",
      user: { name: "Michael Chen", avatar: "/avatars/michael.png" },
      action: "Added New Item",
      itemAffected: "Industrial Valve A-342",
    },
  ];

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-100 space-y-0">
        <CardTitle className="text-base font-semibold text-gray-800">
          Recent System Activity
        </CardTitle>
        <Button 
          variant="ghost" 
          className="text-xs text-gray-500 hover:text-gray-800 p-0 h-auto font-normal"
        >
          View Full Activity Log →
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100">
              <TableHead className="px-6 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                Timestamp
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                User
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                Action Performed
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-wider">
                Item/Record Affected
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((item, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                <TableCell className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                  {item.timestamp}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-100">
                      <AvatarImage src={item.user.avatar} alt={item.user.name} />
                      <AvatarFallback className="bg-gray-300 text-[10px] text-white">
                        {item.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-700 text-sm">{item.user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600 text-sm">
                  {item.action}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600 font-medium text-sm">
                  {item.itemAffected}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};