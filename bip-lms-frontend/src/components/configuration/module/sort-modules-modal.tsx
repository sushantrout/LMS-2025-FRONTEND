"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Module } from "@/types/model/module-model";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { moduleService } from "@/http/module-service";
import { showSuccessToast } from "@/util/helpers/toast-helper";
import { SortRequest } from "@/types/model/sort-model";

interface SortModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: Module[];
  onSave: (sortedModules: Module[]) => void;
  courseId: string;
}

function SortableItem({ module }: { module: Module }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border rounded-lg mb-2 cursor-grab"
    >
      <div {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{module.name}</h4>
        <p className="text-xs text-gray-500">
          {module.sessions?.length || 0} sessions
        </p>
      </div>
    </div>
  );
}

export default function SortModulesModal({
  isOpen,
  onClose,
  modules,
  onSave,
  courseId,
}: SortModulesModalProps) {
  const [localModules, setLocalModules] = useState<Module[]>(modules);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalModules(modules);
  }, [modules]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLocalModules((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex).map((module, index) => ({
          ...module,
          sortOrder: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const sortRequests: SortRequest[] = localModules.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }));
     
      await moduleService.sortModules({
        requests: sortRequests,
      });
      
      // Update the UI
      onSave(localModules);
      showSuccessToast("Modules reordered successfully");
    } catch (error) {
      console.error("Error sorting modules:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sort Modules</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Drag and drop modules to reorder them. Click save when you're done.
            </p>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localModules.map(m => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2">
                {localModules.map((module) => (
                  <SortableItem key={module.id} module={module} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 