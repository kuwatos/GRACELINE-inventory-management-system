"use client";

import { useState } from "react";
import { Plus, Search, Eye, Edit, Trash2, Folder, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export interface Project {
  projectId: number;
  projectName: string;
  archived: boolean | null;
}

interface ProjectTableProps {
  data: Project[]; 
  // 👈 THE FIX: Now these accept the whole Project object
  onViewProject: (project: Project) => void;
  onEditProject: (project: Project) => void; 
  onDeleteProject: (project: Project) => void;
  onCreateClick: () => void;
}

export function ProjectTable({ 
  data = [], 
  onViewProject, 
  onEditProject, 
  onDeleteProject, // 👈 Added this to match Manager
  onCreateClick 
}: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = data.filter(p => 
    p.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">

      {/* TABLE SECTION */}
      <Card className="bg-white shadow-sm border-slate-200 rounded-xl overflow-hidden ">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
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
                <TableRow key={p.projectId} className="group hover:bg-[#0f172a] border-b border-slate-100 last:border-0 transition-colors">
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      {/* Added group-hover:bg-transparent and group-hover:border-transparent so the white icon shows clearly */}
                      <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-transparent flex items-center justify-center border border-slate-200 group-hover:border-transparent transition-colors">
                        {/* Added group-hover:text-white */}
                        <Folder className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                      {/* Added group-hover:text-white */}
                      <span className="font-medium text-slate-900 group-hover:text-white transition-colors">{p.projectName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 px-6">
                    {/* Added group-hover:text-white to the buttons container */}
                    <div className="flex justify-end gap-2 text-slate-400 group-hover:text-white transition-colors">
                      {/* 👈 Passing the whole object 'p' back up */}
                      <Button variant="ghost" size="icon" onClick={() => onViewProject(p)} className="h-8 w-8 hover:text-zinc-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEditProject(p)} className="h-8 w-8 hover:text-zinc-900">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteProject(p)} 
                        className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
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