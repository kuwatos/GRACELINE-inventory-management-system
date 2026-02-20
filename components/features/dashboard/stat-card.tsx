"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: { label: string; value: string | number }[];
}

export const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => {
  return (
    <Card className="flex-1 shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {description && (
          <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
            {description.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};