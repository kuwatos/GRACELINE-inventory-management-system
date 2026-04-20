"use client";

import { useState, useTransition } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ProjectTable, Project } from "./project-table";
import { NewProjectModal } from "./new-project-modal"; 
import { EditProjectModal } from "./edit-project-modal"; 
import { deleteProjectAction } from "@/lib/action/project.action";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface ProjectManagerProps {
  data: Project[];
}

export const ProjectManager = ({ data = [] }: ProjectManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Data States (Matches Supplier Pattern)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Filter Logic
  const filteredData = data.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.projectName.toLowerCase().includes(searchLower) ||
      p.projectId.toString().includes(searchLower)
    );
  });

  const handleViewClick = (project: Project) => {
    setSelectedProject(project);
    setIsViewOnly(true);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsViewOnly(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (project: Project) => {
    startTransition(async () => {
      if (confirm(`Are you sure you want to delete ${project.projectName}?`)) {
        await executeAction(async () => { 
            const res = await deleteProjectAction(project.projectId);
            if (!res.success) throw res;
            return res;
          }, "Project archived successfully!");
        }
      })
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <LoadingOverlay isLoading={isPending} message="Updating..." />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">Project Directory</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5"
              />
            </div>

            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-[#0f172a]/70 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </Button>
          </div>
        </div>

        <ProjectTable 
          data={filteredData} 
          onViewProject={handleViewClick} 
          onEditProject={handleEditClick}
          onDeleteProject={handleDeleteClick}
          onCreateClick={() => setIsNewModalOpen(true)}
        />
      </Card>

      <NewProjectModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      <EditProjectModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }} 
        project={selectedProject}
        isViewOnly={isViewOnly}
      />
    </div>
  );
};