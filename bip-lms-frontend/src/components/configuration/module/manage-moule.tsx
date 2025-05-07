import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialModule, Module } from "@/types/model/module-model";
import React, { useState } from "react";

interface ManageCourseModalProps {
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  selectedModule: Module | null;
  isModuleModalOpen: boolean;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManageModuleModal({
  setModules,
  selectedModule,
  isModuleModalOpen,
  setIsModuleModalOpen,
}: ManageCourseModalProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [formData, setFormData] = useState<Module>(initialModule);
  return (
    <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedModule ? "Edit Course" : "Add New Course"}
          </DialogTitle>
          <DialogDescription>
            {selectedModule
              ? "Update the details of this course."
              : "Fill in the details to create a new course."}
          </DialogDescription>
        </DialogHeader>
        <form
          //onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border p-6 bg-card shadow-sm"
        >
            

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModuleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedModule ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );;
}
