"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export default function CoursePlayerPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<number[]>([3])

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Video Player */}
        <div className="w-full bg-black aspect-video flex items-center justify-center">
          <button className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto bg-transparent flex w-full justify-start overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="q&a"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Q&A
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="px-4 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 text-gray-600 text-sm font-medium"
              >
                Learning tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="q&a" className="p-4 m-0">
              <div className="space-y-4">
                <div className="relative">
                  <Input type="search" placeholder="Search all course questions" className="pr-10 border-gray-300" />
                  <Button
                    variant="default"
                    size="icon"
                    className="absolute right-0 top-0 h-full rounded-l-none bg-purple-600 hover:bg-purple-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap justify-between items-end gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Filters:</p>
                    <Button variant="outline" size="sm" className="text-sm h-9 border-gray-300">
                      All lectures
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
                        className="ml-2 h-4 w-4"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sort by:</p>
                    <Button variant="outline" size="sm" className="text-sm h-9 border-gray-300">
                      Sort by recommended
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
                        className="ml-2 h-4 w-4"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 h-9"
                  >
                    Filter questions
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="p-4 m-0">
              <p className="text-sm text-gray-600">Course overview content would appear here.</p>
            </TabsContent>

            {/* Other tab contents would go here */}
          </Tabs>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "overview" && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Master Microservices with Spring Boot and Spring Cloud</h1>
              <p className="text-gray-700 mb-6">
                Learn how to create awesome Microservices and RESTful web services with Spring Boot and Spring Cloud.
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Develop RESTful web services with Spring Boot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Implement Exception Handling and Validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Create Microservices with Spring Cloud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mt-0.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Implement Service Registration and Discovery</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-[400px] flex flex-col h-full bg-white border-l border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-gray-800">Course content</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-normal"
            >
              <span className="flex items-center gap-1">
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
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
                AI Assistant
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Course Sections */}
        <div className="flex-1 overflow-auto">
          {courseSections.map((section) => (
            <div key={section.id} className="border-b border-gray-200">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
              >
                <div className="flex-1 pr-2">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    Section {section.id}: {section.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>
                      {section.completedLessons}/{section.totalLessons}
                    </span>
                    <span className="mx-1">|</span>
                    <span>{section.duration}</span>
                  </div>
                </div>
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Section Lessons */}
              {expandedSections.includes(section.id) && (
                <div className="bg-gray-50">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex gap-3 px-4 py-3 hover:bg-gray-100 ${lesson.id === 13 ? "bg-gray-100" : ""}`}
                    >
                      <Checkbox
                        id={`lesson-${section.id}-${lesson.id}`}
                        className="mt-0.5"
                        checked={lesson.completed}
                      />
                      <div className="space-y-1 flex-1">
                        <label
                          htmlFor={`lesson-${section.id}-${lesson.id}`}
                          className="text-sm font-medium leading-tight cursor-pointer text-gray-800"
                        >
                          {lesson.id}. {lesson.title}
                        </label>
                        <div className="flex items-center gap-1 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="text-xs">{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Course data
const courseSections = [
  {
    id: 1,
    title: "Master Microservices with Spring Boot and Spring Cloud - Getting Started",
    totalLessons: 5,
    completedLessons: 0,
    duration: "8min",
    lessons: [],
  },
  {
    id: 2,
    title: "Introduction To Web Services - V3",
    totalLessons: 5,
    completedLessons: 0,
    duration: "15min",
    lessons: [],
  },
  {
    id: 3,
    title: "Restful Web Services with Spring Boot - V3",
    totalLessons: 54,
    completedLessons: 1,
    duration: "4hr 56min",
    lessons: [
      {
        id: 11,
        title: "Course Downloads",
        duration: "1min",
        completed: false,
      },
      {
        id: 12,
        title: "Restful Web Services - Section Introduction",
        duration: "1min",
        completed: false,
      },
      {
        id: 13,
        title: "DO NOT SKIP: New to Spring or Spring Boot?",
        duration: "1min",
        completed: true,
      },
      {
        id: 14,
        title: "Step 00 - Creating a REST API with Spring Boot - An Overview",
        duration: "4min",
        completed: false,
      },
      {
        id: 15,
        title: "CODE BACKUP FILES and STEP BY STEP CHANGES : For Reference",
        duration: "1min",
        completed: false,
      },
      {
        id: 16,
        title: "Step 01 - Initializing a REST API Project with Spring Boot",
        duration: "7min",
        completed: false,
      },
      {
        id: 17,
        title: "Step 02 - Creating a Hello World REST API with Spring Boot",
        duration: "6min",
        completed: false,
      },
    ],
  },
]
