// app/components/features/users/user-table.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  onEdit: (user: any) => void;
}

const MOCK_USERS = [
  { id: "USER 3001", username: "John Carlo Benter", dept: "Warehouse" },
  { id: "USER 3002", username: "Sara Mitchell", dept: "Purchasing" },
  { id: "USER 3003", username: "Michael Chen", dept: "Admin" },
  { id: "USER 3004", username: "Gustavo Fring", dept: "Finance" },
  { id: "USER 3005", username: "John Davis", dept: "Warehouse" },
  { id: "USER 3006", username: "Sarah Johnson", dept: "Admin" },
];

export const UserTable = ({ onEdit }: UserTableProps) => {
  return (
    <div className="rounded-md border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold text-center">User ID</th>
            <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold text-center">Username</th>
            <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold text-center">Department</th>
            <th className="px-8 py-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MOCK_USERS.map((user) => (
            <tr key={user.id} className="group hover:bg-black transition-colors cursor-default">
              <td className="px-8 py-5 text-[12px] text-gray-500 group-hover:text-zinc-400 text-center font-mono">{user.id}</td>
              <td className="px-8 py-5 font-medium text-gray-800 group-hover:text-white text-center">{user.username}</td>
              <td className="px-8 py-5 text-gray-600 group-hover:text-zinc-300 text-center">{user.dept}</td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-7 px-4 text-[10px] font-bold uppercase bg-white text-black hover:bg-gray-200"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};