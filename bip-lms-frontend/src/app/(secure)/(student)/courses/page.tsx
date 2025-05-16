"use client";
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState, useCallback } from "react"
import { courseService } from "@/http/course-service"
import { Course } from "@/types/model/course-model";
import CourseCard from "@/components/courses/course-card";
import { useDebounce } from "@/hooks/use-debounce";

export default function CourseCatalog() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const getCourses = useCallback((searchKey?: string, sort?: string) => {
    courseService.getCourseList(searchKey, sort).then((res) => {
      setCourseList(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    let sortParam: string | undefined;
    
    switch (activeTab) {
      case "newest":
        sortParam = "createdOn,DESC";
        break;
      case "popular":
        sortParam = "rating,DESC";
        break;
      default:
        sortParam = undefined;
    }
    
    getCourses(debouncedSearchQuery, sortParam);
  }, [debouncedSearchQuery, activeTab, getCourses]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Course Catalog</h1>
        </div>

        <div className="flex gap-4 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search for courses..." 
              className="w-full pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Tabs defaultValue="all" className="mb-8" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {courseList.map((course) => (
                <CourseCard key={course.id} course={course} type="catalog" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {courseList.map((course) => (
                <CourseCard key={course.id} course={course} type="catalog" />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="newest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {courseList.map((course) => (
                <CourseCard key={course.id} course={course} type="catalog" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
