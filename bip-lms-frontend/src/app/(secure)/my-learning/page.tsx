"use client"

import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MyLearning() {
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 8

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(courses.length / coursesPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

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
              className={`h-8 w-8 ${currentPage === number ? "bg-purple-600 hover:bg-purple-700" : ""}`}
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
        Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, courses.length)} of {courses.length} courses
      </div>
    </div>
  )
}

interface Course {
  id: number
  title: string
  instructor: string
  progress: number
  image: string
  rating?: number
  hasRated: boolean
  startCourse?: boolean
}

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  return (
    <div className="border rounded-md overflow-hidden flex flex-col" onClick={() => {router.push("/my-learning/ID")}}>
      <div className="relative">
        <Image
          src={"/images/course/course-cover.avif"}
          alt={course.title}
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
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">{course.progress}% complete</span>
            {course.hasRated ? (
              <span className="text-xs text-gray-600">Your rating</span>
            ) : (
              <span className="text-xs text-gray-600">Leave a rating</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>

            <div className="ml-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${course.rating && star <= course.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>

          {course.startCourse && (
            <Button variant="ghost" className="w-full mt-4 text-gray-700 hover:text-gray-900 justify-start px-0">
              START COURSE
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Expanded course data to demonstrate pagination
const courses: Course[] = [
  {
    id: 1,
    title: "Master Microservices with Spring Boot and Spring Cloud",
    instructor: "in28Minutes Official",
    progress: 13,
    image: "/placeholder.svg?height=225&width=400",
    rating: 5,
    hasRated: true,
  },
  {
    id: 2,
    title: "Machine Learning A-Z: AI, Python & R + ChatGPT Prize [2025]",
    instructor: "Kirill Eremenko, Hadelin de Ponteves, SuperDataScience",
    progress: 6,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
  },
  {
    id: 3,
    title: "The Complete ServiceNow System Administrator Course",
    instructor: "Mark Miller, Shivaram Umapathy",
    progress: 37,
    image: "/placeholder.svg?height=225&width=400",
    rating: 4,
    hasRated: true,
  },
  {
    id: 4,
    title: "The Complete Guide to Service Portal in ServiceNow",
    instructor: "Mark Miller, Shivaram Umapathy",
    progress: 2,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
  },
  {
    id: 5,
    title: "The Complete ServiceNow Developer Course",
    instructor: "Mark Miller, Shivaram Umapathy",
    progress: 0,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
    startCourse: true,
  },
  {
    id: 6,
    title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02 2025",
    instructor: "Stephane Maarek | AWS Certified Cloud Practitioner",
    progress: 0,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
    startCourse: true,
  },
  {
    id: 7,
    title: "Java Programming, Lambda and more (Java 13, 12, 11, 10, 9,8)",
    instructor: "Syed Ahmed",
    progress: 40,
    image: "/placeholder.svg?height=225&width=400",
    rating: 5,
    hasRated: true,
  },
  {
    id: 8,
    title: "Docker - A Beginner's Tutorials",
    instructor: "Rajkumar B",
    progress: 0,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
    startCourse: true,
  },
  {
    id: 9,
    title: "Advanced React and Redux",
    instructor: "Stephen Grider",
    progress: 25,
    image: "/placeholder.svg?height=225&width=400",
    rating: 4,
    hasRated: true,
  },
  {
    id: 10,
    title: "The Complete Node.js Developer Course",
    instructor: "Andrew Mead",
    progress: 15,
    image: "/placeholder.svg?height=225&width=400",
    rating: 5,
    hasRated: true,
  },
  {
    id: 11,
    title: "Modern JavaScript From The Beginning",
    instructor: "Brad Traversy",
    progress: 60,
    image: "/placeholder.svg?height=225&width=400",
    rating: 4,
    hasRated: true,
  },
  {
    id: 12,
    title: "Python for Data Science and Machine Learning Bootcamp",
    instructor: "Jose Portilla",
    progress: 10,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
  },
  {
    id: 13,
    title: "The Web Developer Bootcamp",
    instructor: "Colt Steele",
    progress: 75,
    image: "/placeholder.svg?height=225&width=400",
    rating: 5,
    hasRated: true,
  },
  {
    id: 14,
    title: "Angular - The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    progress: 30,
    image: "/placeholder.svg?height=225&width=400",
    rating: 4,
    hasRated: true,
  },
  {
    id: 15,
    title: "iOS 13 & Swift 5 - The Complete iOS App Development Bootcamp",
    instructor: "Dr. Angela Yu",
    progress: 0,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
    startCourse: true,
  },
  {
    id: 16,
    title: "Flutter & Dart - The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    progress: 0,
    image: "/placeholder.svg?height=225&width=400",
    hasRated: false,
    startCourse: true,
  },
]
