"use client";
import { Search, SlidersHorizontal, Bell, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useEffect, useState } from "react"
import { courseService } from "@/http/course-service"
import { Course } from "@/types/model/course-model";

export default function CourseCatalog() {

  const [courseList, setCourseList] = useState<Course[]>([]);

  const getCourses = ()=> {
    courseService.getCourseList().then((res) => {
      console.log(res?.data?.data);
      setCourseList(res?.data?.data);
    });
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container px-4 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">Discover and enroll in training courses to develop your skills</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for courses..." className="w-full pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {courseList.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {courseList
                .filter((c) => c.maxRating > 4.5)
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="newest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {courseList.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


function CourseCard({ course }: { course: Course }) {
  console.log(course);
  return (
    // <div>

    // </div>

    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="relative">
        <img src={course?.image || "/images/course/course-cover.avif"} alt={course?.name} className="aspect-video w-full object-cover" />
        <Badge
          className={`absolute left-3 top-3 ${
            course.category?.name === "Leadership"
              ? " "
              : course.category?.name === "Technical Skills"
                ? " "
                : " "
          }`}
        >
          {course.category?.name}
        </Badge>
      </div>
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-xl font-semibold">{course?.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </div>
      <div className="mt-auto p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            </svg>
            <span className="text-sm text-muted-foreground">{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className="text-yellow-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm font-medium">{course?.maxRating}</span>
          </div>
        </div>
        <Link href={`/courses/${course.id}`}>
            <Button className="w-full">View Course</Button>
        </Link>
      </div>
    </div>
  )
}

// const courses: Course[] = [
//   {
//     id: "1",
//     title: "Effective Leadership Skills",
//     description: "Learn key leadership skills to inspire and motivate your team for success.",
//     category: "Leadership",
//     duration: "3h 45m",
//     lessons: 12,
//     rating: 4.8,
//     image: "/images/course/course-cover.avif",
//   },
//   {
//     id: "2",
//     title: "Advanced Excel for Professionals",
//     description: "Master advanced Excel features to analyze data and create powerful reports.",
//     category: "Technical Skills",
//     duration: "5h 20m",
//     lessons: 18,
//     rating: 4.5,
//     image: "/images/course/course-cover.avif",
//   },
//   {
//     id: "3",
//     title: "Communication Mastery",
//     description: "Enhance your communication skills for better workplace relationships.",
//     category: "Soft Skills",
//     duration: "2h 55m",
//     lessons: 9,
//     rating: 4.7,
//     image: "/images/course/course-cover.avif",
//   },
//   {
//     id: "4",
//     title: "Cybersecurity Essentials",
//     description: "Learn essential cybersecurity practices to protect company data.",
//     category: "Technical Skills",
//     duration: "4h 10m",
//     lessons: 14,
//     rating: 4.6,
//     image: "/images/course/course-cover.avif",
//   },
// ]
