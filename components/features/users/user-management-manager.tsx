"use client";

import { deleteUserAction } from "@/lib/action/user.action"; // Make sure this path matches!
import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserTable, User } from "./user-table";
import { NewUserModal } from "./new-user-modal";
import { EditUserModal } from "./edit-user-modal";

interface UserManagementManagerProps {
  data?: User[];
}

export const UserManagementManager = ({ data = [] }: UserManagementManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); 
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    const isConfirmed = window.confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`);
    
    if (isConfirmed) {
      try {
        // 2. Send the ID across the bridge to your Robot Butler
        const result = await deleteUserAction(user.id);

        if (!result.success) {
          console.error("Failed to delete user:", result.error);
          alert("Failed to delete user. Please try again.");
        }
      } catch (error) {
        console.error("Server error during deletion:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">System Users</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Username, ID..." // Updated placeholder
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
              />
            </div>
            
            <div className="relative">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="finance">Finance</option>
                <option value="purchasing">Purchasing</option> {/* Fixed Typo */}
                <option value="warehouse">Warehouse</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

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