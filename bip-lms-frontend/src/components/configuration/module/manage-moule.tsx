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
  const [formData, setFormData] = useState<Module>(initialModule);
  return <div></div>;
}
