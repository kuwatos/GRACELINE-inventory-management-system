// app/components/features/users/user-management-manager.tsx
"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserTable } from "./user-table";
import { UserModal } from "./user-modal";

export const UserManagementManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by Username..." 
                className="pl-11 h-12 border-gray-200 focus-visible:ring-black rounded-md"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none h-12 px-6 bg-[#E5E7EB] rounded-md text-sm font-medium pr-12 focus:outline-none cursor-pointer">
                <option>Search Filters</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <Button 
              onClick={handleAddUser}
              className="bg-black text-white hover:bg-zinc-800 h-12 px-6 rounded-md font-bold transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        <UserTable onEdit={handleEditUser} />
      </Card>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        user={selectedUser}
      />
    </div>
  );
};