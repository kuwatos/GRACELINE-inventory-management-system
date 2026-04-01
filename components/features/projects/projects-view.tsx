"use client";

import { Plus, Search, Eye, Edit, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

// Mock data for the project list
const projects = [
  { id: "1", name: "Warehouse Expansion" },
  { id: "2", name: "Inventory Automation" },
  { id: "3", name: "Supplier Portal V2" },
];

interface ProjectsViewProps {
  onViewProject: (id: string) => void;
  onEditProject: (id: string) => void; // Added for the edit functionality
  onCreateClick: () => void;
}

export function ProjectsView({ onViewProject, onEditProject, onCreateClick }: ProjectsViewProps) {
  return (
    <div className="w-full space-y-6 p-10 animate-in fade-in duration-500 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
        <Button 
          onClick={onCreateClick} 
          className="bg-zinc-900 hover:bg-zinc-800 gap-2 h-10 px-6 rounded-md transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" /> Create a Project
        </Button>
      </div>

      {/* Table Container */}
      <Card className="shadow-none border border-slate-100 rounded-xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 flex items-center border-b border-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 bg-slate-50/50 border-none h-10 focus-visible:ring-1 focus-visible:ring-slate-200" 
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50/30">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="font-bold py-4 text-slate-900">Project Name</TableHead>
              <TableHead className="text-right font-bold py-4 px-8 text-slate-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow 
                key={p.id} 
                className="hover:bg-slate-50/20 border-b border-slate-50 last:border-0 transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-slate-300" strokeWidth={1.5} />
                    <span className="font-medium text-slate-700">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-8">
                  <div className="flex justify-end gap-4 text-slate-400">
                    {/* View Button */}
                    <button 
                      onClick={() => onViewProject(p.id)} 
                      className="p-1 rounded-md transition-colors hover:text-zinc-900 hover:bg-slate-100"
                      title="View Project"
                    >
                      <Eye className="h-5 w-5" />
                    </button>

                    {/* Edit Button - Linked to onEditProject */}
                    <button 
                      onClick={() => onEditProject(p.id)} 
                      className="p-1 rounded-md transition-colors hover:text-zinc-900 hover:bg-slate-100"
                      title="Edit Project"
                    >
                      <Edit className="h-5 w-5" />
                    </button>

                    {/* Delete Button */}
                    <button 
                      className="p-1 rounded-md transition-colors hover:text-red-600 hover:bg-red-50"
                      title="Delete Project"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}