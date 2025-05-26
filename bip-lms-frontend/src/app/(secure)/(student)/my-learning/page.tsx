"use client";

import {
  Search,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/http/course-service";
import { Course } from "@/types/model/course-model";
import { getImageSrc } from "@/util/helpers/application-data-converter-util";

const MyLearning = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [enrolledCourse, setEnrolledCourse] = useState<Course[]>([]);

  const getEnrolledCourse = () => {
    courseService.getEnrolledCourse().then((res) => {
      setEnrolledCourse(res?.data?.data);
    });
  };

  useEffect(() => {
    getEnrolledCourse();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Learning</h1>
      </div>
      {/* <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Sort by</p>
              <Button variant="outline" className="w-full sm:w-auto">
                Recently Accessed <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Filter by</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  Categories <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Progress <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Instructor <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost">Reset</Button>
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <div className="relative w-full md:w-64">
              <Input type="text" placeholder="Search my courses" className="pr-10" />
              <Button
                variant="default"
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none bg-purple-600 hover:bg-purple-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enrolledCourse &&
          enrolledCourse.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
      </div>

      {/* Pagination */}
      {/* <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(number)}
              className={`h-8 w-8 ${
                currentPage === number
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }`}
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
        {Array.isArray(enrolledCourse) && enrolledCourse.length > 0 ? (
          <>
            Showing {indexOfFirstCourse + 1}-
            {Math.min(indexOfLastCourse, enrolledCourse.length)} of{" "}
            {enrolledCourse.length} courses
          </>
        ) : (
          <>No courses to show</>
        )}
      </div> */}
    </div>
  );
};

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  return (
    <div
      className="border rounded-md overflow-hidden flex flex-col"
      onClick={() => {
        router.push("/my-learning/" + course.id);
      }}
    >
      <div className="relative">
        <Image
          src={
            course?.coverImage
              ? getImageSrc(course.coverImage)
              : "/images/course/course-cover.avif"
          }
          alt={course.name}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            <DropdownMenuItem>Share course</DropdownMenuItem>
            <DropdownMenuItem>Hide course</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{course.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription}
        </p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">
              {course.progress}% complete
            </span>
            {course.rating ? (
              <span className="text-xs text-gray-600">Your rating</span>
            ) : (
              <span className="text-xs text-gray-600">Rating</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <div className="ml-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    course.rating && star <= course.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyLearning;
