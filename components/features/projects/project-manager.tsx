"use client";

import { useState } from "react";
import { ProjectTable } from "./project-table";
import { ViewProjectModal } from "./view-project-modal";
import { NewProjectModal } from "./new-project-modal"; 
import { EditProjectModal } from "./edit-project-modal"; 
import { Card } from "@/components/ui/card";

export function ProjectManager() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Schema-matching mock data (No status!)
  const mockData = [
    { id: "4000001", name: "Warehouse Expansion" },
    { id: "4000002", name: "Inventory Automation" },
    { id: "4000003", name: "Supplier Portal V2" },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <ProjectTable 
        data={mockData} 
        onViewProject={setActiveProjectId} 
        onEditProject={setEditingProjectId}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      <ViewProjectModal  
        projectId={activeProjectId} 
        onOpenChange={(open) => !open && setActiveProjectId(null)} 
      />

      <EditProjectModal 
        projectId={editingProjectId} 
        onOpenChange={(open) => !open && setEditingProjectId(null)} 
      />

      <NewProjectModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </Card>
    </div>
  );
}