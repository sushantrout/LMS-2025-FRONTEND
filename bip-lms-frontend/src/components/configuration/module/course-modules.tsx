"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Module } from "@/types/model/module-model"

export default function CourseModules({courseId, modules, setModules, getModulesByCourseId, setSelectedModule, setIsModuleModalOpen}: { courseId: string, modules: Module[], setModules: React.Dispatch<React.SetStateAction<Module[]>>, getModulesByCourseId: () => void , setSelectedModule: React.Dispatch<React.SetStateAction<Module | null>>, setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  useEffect(() => {
    getModulesByCourseId();
  }
  , [courseId]);

  const toggleModule = (id: string) => {
    setModules(modules.map((module) => (module.id === id ? { ...module, expanded: !module.expanded } : module)))
  }

  return (
    <div className="grid grid-cols-1">
      <div className="md:col-span-2 space-y-4">
        {modules.map((module) => (
          <Card key={module.id} className="p-4">
            <div className="flex items-start">
              <button onClick={() => toggleModule(module.id)} className="mr-2 mt-1">
                {module.expanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium">
                    {module.name}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Sort Lessons
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8 flex items-center gap-1" onClick={() => {
                      setSelectedModule(module);
                      setIsModuleModalOpen(true);
                    }}>
                      <Edit className="h-3 w-3" />
                      Edit Module
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8 text-red-500 flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      Delete Module
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
    </div>

  )
}
