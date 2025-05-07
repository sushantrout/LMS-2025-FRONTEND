"use client";

import {
  BookOpen,
  FileQuestion,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Course } from "@/types/model/course-model";
import { Module } from "@/types/model/module-model";
import { courseService } from "@/http/course-service";
import { moduleService } from "@/http/module-service";

import CourseModules from "./course-modules";
import ManageSessionModal from "./section/manage-session";
import ManageModuleModal from "./module/manage-moule";

export default function ManageCoursePage({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Module | null>(null);

  const fetchModules = useCallback(async () => {
    try {
      const response = await moduleService.getModuleByCourseId(courseId);
      setModules(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseDetail(courseId);
        setCourse(response.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };

    if (courseId) {
      fetchCourse();
      fetchModules();
    }
  }, [courseId, fetchModules]);

  const commonButtonClass =
    "h-auto py-3 justify-start gap-3 border-primary/20 hover:bg-primary/5 transition duration-200 hover:scale-[1.02] shadow-sm";
  const iconStyle =
    "w-10 h-10 flex items-center justify-center rounded-full border";

  return (
    <div className="container p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {course?.name || "Loading Course..."}
        </h1>
      </header>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className={commonButtonClass}
            onClick={() => {
              setSelectedModule(null);
              setIsModuleModalOpen(true);
            }}
          >
            <div className={`${iconStyle} bg-primary/10 border-primary/30`}>
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-primary font-medium">Add Module</span>
          </Button>

          <Button variant="outline" className={commonButtonClass} onClick={() => {
              setSelectedSession(null);
              setIsSessionModalOpen(true);
            }
          }>
            <div className={`${iconStyle} bg-blue-50 border-blue-200`}>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-blue-600 font-medium">Add Session</span>
          </Button>

          <Button variant="outline" className={commonButtonClass}>
            <div className={`${iconStyle} bg-red-50 border-red-200`}>
              <FileQuestion className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-red-500 font-medium">Add Quiz</span>
          </Button>

          <Button variant="outline" className={commonButtonClass}>
            <div className={`${iconStyle} bg-yellow-50 border-yellow-200`}>
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-yellow-600 font-medium">Add Assignment</span>
          </Button>
        </div>

        <CourseModules
          modules={modules}
          courseId={courseId}
          setModules={setModules}
          setSelectedModule={setSelectedModule}
          setIsModuleModalOpen={setIsModuleModalOpen}
          getModulesByCourseId={fetchModules}
        />

        <ManageModuleModal
          courseId={courseId}
          selectedModule={selectedModule}
          isModuleModalOpen={isModuleModalOpen}
          setSelectedModule={setSelectedModule}
          setIsModuleModalOpen={setIsModuleModalOpen}
          setModules={setModules}
          getModulesByCourseId={fetchModules}
        />
        
        <ManageSessionModal
          courseId={courseId}
          selectedSession={selectedSession}
          isSessionModalOpen={isSessionModalOpen}
          setIsSessionModalOpen={setIsSessionModalOpen}
          getModulesByCourseId={fetchModules}
        />
      </div>
    </div>
  );
}
