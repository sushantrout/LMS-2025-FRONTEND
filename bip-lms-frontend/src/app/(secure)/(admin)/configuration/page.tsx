"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courseService } from "@/http/course-service";
import { Course } from "@/types/model/course-model";
import CourseCard from "@/components/courses/course-card";
import ManageCourseModal from "@/components/courses/manage-course-modal";

export default function CourseCatalog() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const getCourses = () => {
    courseService.getCourseList().then((res) => {
      setCourses(res?.data?.data);
    });
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Course Catalog
          </h1>
          <Button onClick={() => {setOpenCourseModal(true)}}>Create Course</Button>
        </div>
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for courses..."
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <CourseGrid courses={courses} setSelectedCourse={setSelectedCourse} setOpenCourseModal={setOpenCourseModal}/>
        <ManageCourseModal
          selectedCourse={selectedCourse}
          isCourseModalOpen={openCourseModal}
          setIsCourseModalOpen={setOpenCourseModal}
          setCourses={setCourses}
        />
      </main>
    </div>
  );
}

function CourseGrid({ courses, setSelectedCourse, setOpenCourseModal }: { courses: Course[], setSelectedCourse : any, setOpenCourseModal: any }) {
  console.log(courses);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} type="catalog"  setSelectedCourse={setSelectedCourse} setOpenCourseModal={setOpenCourseModal}/>
        ))}
      </div>
    </>
  );
}
