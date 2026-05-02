"use client";

import { deleteUserAction } from "@/lib/action/user.action"; // Make sure this path matches!
import { useState, useTransition } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserTable, User } from "./user-table";
import { NewUserModal } from "./new-user-modal";
import { EditUserModal } from "./edit-user-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface UserManagementManagerProps {
  data?: User[];
}

export const UserManagementManager = ({ data = [] }: UserManagementManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); 
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  // UPDATED: Search filter logic mimicking the Inventory and Supplier tabs
  const filteredData = data.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    
    // 1. Check if the typed text matches Name, Username, ID, or Department
    const matchesSearch = 
      fullName.includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.id.toString().includes(searchLower) || // Changed from id to userId.toString()
      user.department.toLowerCase().includes(searchLower);

    // 2. Check if the dropdown matches the user's department
    const matchesRole = roleFilter === "" || user.department === roleFilter;

    // 3. Return true ONLY if both match!
    return matchesSearch && matchesRole;
  });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

 const handleDeleteClick = async (user: User) => {
    // 1. Ask for confirmation so they don't accidentally delete someone!
      startTransition(async () => {
      const isConfirmed = window.confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`);
      
      if (isConfirmed) {
          await executeAction(async () => { 
            const res = await deleteUserAction(user.id)
            if (!res.success) throw res;
            return res;
          }, "User deleted successfully!");
        }
  });
}

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <LoadingOverlay isLoading={isPending} message="Loading..." />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">System Users</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Username, ID..." // Updated placeholder
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5"
              />
            </div>
            
            <Select 
              value={roleFilter} 
              onValueChange={(value) => setRoleFilter(value)}
            >
              {/* 👇 Forced !h-11 height and flat gray styling */}
             <SelectTrigger className="h-11! w-[200px] px-5 bg-[#E5E7EB] border-none shadow-none rounded-xl text-sm font-medium text-gray-900! focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer hover:bg-gray-300 transition-colors">
                  <SelectValue placeholder="Filter by Roles" />
                </SelectTrigger>
              
              {/* The 5px gap dropdown menu */}
              <SelectContent 
                position="popper" 
                sideOffset={5} 
                className="rounded-xl border-slate-200 shadow-lg bg-white p-1"
              >
                <SelectItem 
                  value="all" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  All Roles
                </SelectItem>
                <SelectItem 
                  value="admin" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Admin
                </SelectItem>
                <SelectItem 
                  value="finance" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Finance
                </SelectItem>
                <SelectItem 
                  value="purchasing" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Purchasing
                </SelectItem>
                <SelectItem 
                  value="warehouse" 
                  className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                >
                  Warehouse
                </SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-[#0f172a]/70 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New User
            </Button>
          </div>
        </div>

        <UserTable 
          data={filteredData} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
      </Card>

      <NewUserModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};