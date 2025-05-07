"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Module } from "@/types/model/module-model";
import { moduleService } from "@/http/module-service";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

interface CourseModulesProps {
  courseId: string;
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  getModulesByCourseId: () => void;
  setSelectedModule: React.Dispatch<React.SetStateAction<Module | null>>;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CourseModules({
  courseId,
  modules,
  setModules,
  getModulesByCourseId,
  setSelectedModule,
  setIsModuleModalOpen,
}: CourseModulesProps) {
  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);

  useEffect(() => {
    getModulesByCourseId();
  }, [courseId, getModulesByCourseId]);

  // Toggle the expanded state of a module
  const toggleModule = useCallback((id: string) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === id ? { ...module, expanded: !module.expanded } : module
      )
    );
  }, [setModules]);

  // Handle deletion of a module
  const handleDeleteModule = async () => {
    if (moduleToDelete) {
      try {
        await moduleService.deleteModule(moduleToDelete.id);
        getModulesByCourseId(); // Refresh modules list after deletion
        setIsDeleteModalOpen(false); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  // Render the modules with proper actions
  const renderModuleActions = (module: Module) => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="text-xs h-8">
        Sort Lessons
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 flex items-center gap-1"
        onClick={() => {
          setSelectedModule(module);
          setIsModuleModalOpen(true);
        }}
      >
        <Edit className="h-3 w-3" />
        Edit Module
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 text-red-500 flex items-center gap-1"
        onClick={() => {
          setModuleToDelete(module);
          setIsDeleteModalOpen(true); // Open delete confirmation modal
        }}
      >
        <Trash2 className="h-3 w-3" />
        Delete Module
      </Button>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1">
        <div className="md:col-span-2 space-y-4">
          {modules.map((module) => (
            <Card key={module.id} className="p-4">
              <div className="flex items-start">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="mr-2 mt-1"
                >
                  {module.expanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">{module.name}</h3>
                    {renderModuleActions(module)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)} // Close the modal on cancel
        onDelete={handleDeleteModule} // Handle deletion
        title="Are you sure?"
        description="This action cannot be undone. The module will be permanently deleted."
      />
    </>
  );
}
