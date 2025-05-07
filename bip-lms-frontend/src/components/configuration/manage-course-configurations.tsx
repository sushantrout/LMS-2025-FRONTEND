"use client";

import {
  BookOpen,
  FileQuestion,
  FileText,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/model/course-model";
import { courseService } from "@/http/course-service";
import { useEffect, useState } from "react";
import CourseModules from "./module/course-modules";
import { Module } from "@/types/model/module-model";
import ManageModuleModal from "./module/manage-moule";
import { moduleService } from "@/http/module-service";

export default function ManageCoursePage({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course>({});
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const getModulesByCourseId = () => moduleService.getModuleByCourseId(courseId).then(async (modules) => {
    setModules(modules.data?.data || []);
  });

  useEffect(() => {
    if (courseId) {
      courseService.getCourseDetail(courseId).then((res) => {
        setCourse(res.data.data);
      });
    }
  }, [courseId]);

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
          {/* Add Module */}
          <Button variant="outline" className={commonButtonClass} onClick={() => setIsModuleModalOpen(true)}>
            <div className={`${iconStyle} bg-primary/10 border-primary/30`}>
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="text-primary font-medium">Add Module</span>
          </Button>

          {/* Add Lesson */}
          <Button variant="outline" className={commonButtonClass}>
            <div className={`${iconStyle} bg-blue-50 border-blue-200`}>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-blue-600 font-medium">Add Lesson</span>
          </Button>

          {/* Add Quiz */}
          <Button variant="outline" className={commonButtonClass}>
            <div className={`${iconStyle} bg-red-50 border-red-200`}>
              <FileQuestion className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-red-500 font-medium">Add Quiz</span>
          </Button>

          {/* Add Assignment */}
          <Button variant="outline" className={commonButtonClass}>
            <div className={`${iconStyle} bg-yellow-50 border-yellow-200`}>
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-yellow-600 font-medium">Add Assignment</span>
          </Button>
        </div>
        <CourseModules  setIsModuleModalOpen={setIsModuleModalOpen} courseId={courseId} modules={modules} setSelectedModule={setSelectedModule} setModules={setModules} getModulesByCourseId={getModulesByCourseId}/>
        <ManageModuleModal setSelectedModule={setSelectedModule}  setModules={setModules} selectedModule={selectedModule} isModuleModalOpen={isModuleModalOpen} setIsModuleModalOpen={setIsModuleModalOpen}  courseId={courseId} getModulesByCourseId={getModulesByCourseId}></ManageModuleModal>
      </div>
    </div>
  );
}
