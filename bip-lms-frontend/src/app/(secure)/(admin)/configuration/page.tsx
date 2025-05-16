"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courseService } from "@/http/course-service";
import { courseCategoryService } from "@/http/course-category-service";
import { Course } from "@/types/model/course-model";
import CourseCard from "@/components/courses/course-card";
import ManageCourseModal from "@/components/courses/manage-course-modal";

export default function CourseCatalog() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const getCourses = () => {
    courseService.getCourseList().then((res) => {
      setCourses(res?.data?.data);
    });
  };

  const getCategories = () => {
    courseCategoryService.getCourseCategoryList().then((res) => {
      setCategories(res?.data?.data);
    });
  };

  useEffect(() => {
    getCourses();
    getCategories();
  }, []);

  // Filter courses by search and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchTerm === "" ||
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const paginatedCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Course Catalog
          </h1>
          <Button onClick={() => {
            setOpenCourseModal(true)
            setSelectedCourse(null);
            }}>Create Course</Button>
        </div>
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>

          {/* May implement this later */}
          {/* <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>

        <CourseGrid courses={paginatedCourses} setSelectedCourse={setSelectedCourse} setOpenCourseModal={setOpenCourseModal}/>
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(number)}
                className={`h-8 w-8 ${currentPage === number ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredCourses.length === 0 ? 0 : indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
        </div>
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
          <CourseCard key={course.id} course={course} type="configuration"  setSelectedCourse={setSelectedCourse} setOpenCourseModal={setOpenCourseModal}/>
        ))}
      </div>
    </>
  );
}
