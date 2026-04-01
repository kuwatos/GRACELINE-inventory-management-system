"use client";

import { useState } from "react";
// Change these to use "./" so they look in the same folder
import { ProjectsView } from "./projects-view";
import { ProjectDetail } from "./project-detail";
import { CreateProjectModal } from "./create-project-modal";
import { EditProjectModal } from "./edit-project-modal"; 
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ProjectsContainer() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="relative">
      <ProjectsView 
        onViewProject={setActiveProjectId} 
        onEditProject={setEditingProjectId}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* View Detail Modal */}
      <Dialog open={!!activeProjectId} onOpenChange={(o) => !o && setActiveProjectId(null)}>
        <DialogContent className="max-w-[900px] h-[85vh] overflow-y-auto p-0 bg-transparent border-none shadow-none outline-none">
          <ProjectDetail projectId={activeProjectId || ""} onClose={() => setActiveProjectId(null)} />
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <EditProjectModal 
        projectId={editingProjectId} 
        onOpenChange={(open) => !open && setEditingProjectId(null)} 
      />

      <CreateProjectModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}