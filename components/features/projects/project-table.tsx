"use client";

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Folder, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export type ProjectRow = {
  id: string;
  name: string;
};

interface ProjectTableProps {
  data: ProjectRow[]; 
  onViewProject: (id: string) => void;
  onEditProject: (id: string) => void; 
  onCreateClick: () => void;
}

export function ProjectTable({ data = [], onViewProject, onEditProject, onCreateClick }: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProjects = data.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this project?")) return;
    setDeletingId(id);
    // Simulate DB delete
    setTimeout(() => setDeletingId(null), 1000); 
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      
      {/* --- UPDATED HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Title & Description */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500">Manage project names and details.</p>
        </div>

        {/* Right Side: Search Bar & Create Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-slate-200 h-10 focus-visible:ring-1 focus-visible:ring-slate-300 transition-all shadow-sm" 
            />
          </div>
          
          <Button 
            onClick={onCreateClick} 
            className="bg-zinc-900 hover:bg-zinc-800 gap-2 h-10 px-4 rounded-md shadow-sm whitespace-nowrap transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> 
            <span className="hidden sm:inline">Create Project</span>
          </Button>
        </div>
      </div>

      {/* --- UPDATED CARD SECTION --- */}
      <Card className="bg-white shadow-sm border-slate-200 rounded-xl overflow-hidden ">
        {/* Notice the search bar container is completely removed from here! */}
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              {/* FIXED: Added px-6 to the left header */}
              <TableHead className="font-semibold text-slate-700 h-11 px-6">Project Name</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 h-11 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-sm text-slate-500">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0 transition-colors">
                  {/* FIXED: Added px-6 to the left cell */}
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                        <Folder className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-slate-900">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 px-6">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <Button variant="ghost" size="icon" onClick={() => onViewProject(p.id)} className="h-8 w-8 hover:text-zinc-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEditProject(p.id)} className="h-8 w-8 hover:text-zinc-900">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(p.id)} 
                        disabled={deletingId === p.id} 
                        className="h-8 w-8 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}