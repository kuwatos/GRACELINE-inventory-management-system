"use client";

import { useState, useRef, useEffect } from "react";
// ADDED THE 'X' ICON HERE
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"; 
import { Input } from "@/components/ui/input";

const INITIAL_PROJECTS = ["Sunrise Villa", "Downtown Oasis", "Metro Transit Hub"];

interface ProjectComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProjectCombobox = ({ value, onChange }: ProjectComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProjects = projects.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  const isExactMatch = projects.some(p => p.toLowerCase() === search.toLowerCase());

  const handleSelect = (project: string) => {
    onChange(project);
    setSearch("");
    setIsOpen(false);
  };

  const handleCreate = () => {
    if (!search) return;
    setProjects(prev => [...prev, search]);
    onChange(search);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* THE UPDATED VISIBLE FIELD */}
      <div
        className={`flex items-center justify-between h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm cursor-pointer transition-all ${isOpen ? "ring-2 ring-green-500 ring-offset-0 border-transparent" : "hover:border-gray-300"}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value || "Select or create a project (Optional)..."}
        </span>
        
        {/* ADDED CLEAR BUTTON LOGIC HERE */}
        <div className="flex items-center gap-2">
          {value && (
            <X 
              className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" 
              onClick={(e) => {
                e.stopPropagation(); // Prevents the dropdown from opening when clicking X
                onChange(""); // Clears the value
              }}
            />
          )}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {/* The Dropdown Menu (Remains Unchanged) */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-50 bg-gray-50/50">
            <Input
              autoFocus
              placeholder="Search or type a new project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 border-none bg-white focus-visible:ring-0 shadow-sm rounded-lg"
            />
          </div>
          
          <div className="max-h-[200px] overflow-y-auto p-1.5">
            {filteredProjects.map((project) => (
              <div
                key={project}
                onClick={() => handleSelect(project)}
                className="flex items-center px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Check className={`mr-2 h-4 w-4 ${value === project ? "opacity-100 text-green-600" : "opacity-0"}`} />
                {project}
              </div>
            ))}

            {search && !isExactMatch && (
              <div
                onClick={handleCreate}
                className="flex items-center px-3 py-2.5 text-sm text-blue-700 font-bold cursor-pointer hover:bg-blue-50 bg-blue-50/50 rounded-lg border border-dashed border-blue-200 mt-1 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create new project: &quot;{search}&quot;
              </div>
            )}
            
            {filteredProjects.length === 0 && isExactMatch && (
              <div className="px-3 py-4 text-center text-sm text-gray-400 font-medium">Project already selected.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};