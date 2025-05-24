"use client"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState, useCallback } from "react"
import { courseService } from "@/http/course-service"
import type { Course } from "@/types/model/course-model"
import CourseCard from "@/components/courses/course-card"
import { useDebounce } from "@/hooks/use-debounce"

export default function CourseCatalog() {
  const [courseList, setCourseList] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 8

  const getCourses = useCallback((searchKey?: string, sort?: string) => {
    courseService.getCourseList(searchKey, sort).then((res) => {
      setCourseList(res?.data?.data)
      setCurrentPage(1) // Reset to first page when search or sort changes
    })
  }, [])

  useEffect(() => {
    let sortParam: string | undefined

    switch (activeTab) {
      case "newest":
        sortParam = "createdOn,DESC"
        break
      case "popular":
        sortParam = "rating,DESC"
        break
      default:
        sortParam = "name"
    }

    getCourses(debouncedSearchQuery, sortParam)
  }, [debouncedSearchQuery, activeTab, getCourses])

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courseList.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(courseList.length / coursesPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Show a subset of pages with current page in the middle when possible
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

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
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {currentCourses.length > 0 ? (
                currentCourses.map((course) => <CourseCard key={course.id} course={course} type="catalog" />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No courses found. Try adjusting your search.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {courseList.length > 0 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {currentCourses.length > 0 ? (
                currentCourses.map((course) => <CourseCard key={course.id} course={course} type="catalog" />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No courses found. Try adjusting your search.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {courseList.length > 0 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="newest" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
              {currentCourses.length > 0 ? (
                currentCourses.map((course) => <CourseCard key={course.id} course={course} type="catalog" />)
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No courses found. Try adjusting your search.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {courseList.length > 0 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                    aria-label={`Page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
