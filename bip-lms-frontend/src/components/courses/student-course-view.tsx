"use client"
import { useEffect, useState } from "react"
import { X, ChevronDown, ChevronUp, Play, FileText, Clock, CheckCircle, Circle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { courseService } from "@/http/course-service"

// Define types based on the expected data structure
type SessionOverview = {
  sessionId: string
  sessionName: string
  duration: string
  sessionDescription: string
  hasResources?: boolean
  videoUrl?: string
}

type Module = {
  moduleId: string
  moduleName: string
  noOfSessions: number
  sessions: SessionOverview[]
}

type CourseOverView = {
  courseId: string
  courseName: string
  modules: Module[]
}

export default function StudentCourseView({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<CourseOverView | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionOverview | null>(null)
  const [progress, setProgress] = useState(42) // Example progress percentage

  useEffect(() => {
    const fetchData = async () => {
        const fetchData = async () => {
            try {
                const response = await courseService.getCourseOverView(courseId);
                setCourse(response.data?.data || null);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        };

        fetchData();
    }

    fetchData()
  }, [courseId])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header with course title and progress */}
        <div className="bg-white border-b px-6 py-4 hidden md:block">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 truncate">{course.courseName || "Course Title"}</h1>
            <div className="flex items-center gap-3">
              <div className="flex flex-col w-48">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Course Progress</span>
                  <span className="text-xs font-medium text-indigo-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <FileText className="h-4 w-4" />
                <span>Certificate</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="w-full bg-gray-900 aspect-video flex items-center justify-center relative group">
          {selectedSession?.videoUrl ? (
            <video className="w-full h-full object-cover" poster="/modern-classroom-thumbnail.png" controls>
              <source src={selectedSession.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors cursor-pointer">
                <Play className="w-10 h-10 fill-white text-white ml-1" />
              </div>
              <p className="text-lg font-medium">
                {selectedSession?.sessionName || "Select a lesson to start learning"}
              </p>
            </div>
          )}

          {/* Video controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <h3 className="font-medium">{selectedSession?.sessionName}</h3>
                <p className="text-sm text-gray-300">{selectedSession?.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <span>1x</span>
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  HD
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white flex-grow overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 bg-white z-10 border-b">
              <TabsList className="h-auto bg-transparent flex w-full justify-start overflow-x-auto px-4">
                {["Overview", "Q&A", "Comments"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 text-gray-600 text-sm font-medium"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedSession?.sessionName || "Course Overview"}
                  </h2>

                  {selectedSession ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          {selectedSession.duration}
                        </Badge>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Beginner
                        </Badge>
                      </div>

                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedSession.sessionDescription ||
                            "<p>No description available for this lesson. Select another lesson to view its content.</p>",
                        }}
                      ></div>
                    </>
                  ) : (
                    <div className="prose max-w-none">
                      <p>
                        This course will teach you everything you need to know about the subject. Select a lesson from
                        the sidebar to begin learning.
                      </p>

                      <h3>What you'll learn</h3>
                      <ul>
                        <li>Fundamental concepts and principles</li>
                        <li>Practical applications and techniques</li>
                        <li>Advanced strategies and methodologies</li>
                        <li>Real-world problem solving</li>
                      </ul>

                      <h3>Course structure</h3>
                      <p>
                        The course is divided into {course.modules.length} modules, each focusing on a specific aspect
                        of the subject matter.
                      </p>
                    </div>
                  )}
                </div>

                {selectedSession && (
                  <Card className="mt-8 bg-indigo-50 border-indigo-100">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3">Resources for this lesson</h3>
                      <div className="grid gap-3">
                        <a
                          href="#"
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <div>
                            <p className="font-medium text-gray-800">Lesson slides</p>
                            <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                          </div>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-indigo-600" />
                          <div>
                            <p className="font-medium text-gray-800">Practice exercises</p>
                            <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                          </div>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="q&a" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions & Answers</h2>
                  <p className="text-gray-600 mb-6">
                    Ask questions about the course content and get answers from instructors and fellow students.
                  </p>

                  <div className="relative mb-8">
                    <Input
                      type="search"
                      placeholder="Search all course questions"
                      className="pr-10 border-gray-300 bg-gray-50 pl-4 py-6"
                    />
                    <Button className="absolute right-1 top-1" variant="ghost" size="icon">
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
                        className="text-gray-500"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </Button>
                  </div>

                  <Button className="mb-8">Ask a New Question</Button>

                  <div className="space-y-6">
                    {/* Example Q&A items */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              How do I implement the concepts from Module 2?
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Posted by Alex • 2 days ago</p>
                          </div>
                          <Badge>2 answers</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <div className="bg-indigo-100 text-indigo-600 h-full w-full flex items-center justify-center font-medium">
                              JD
                            </div>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">John Doe</span>
                              <Badge variant="outline" className="text-xs">
                                Instructor
                              </Badge>
                            </div>
                            <p className="text-gray-700">
                              The concepts from Module 2 can be implemented by following the step-by-step guide in the
                              resources section. Let me know if you need further clarification!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-800">Course content</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {progress}% complete
            </Badge>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {course.modules.map((module, moduleIndex) => (
            <div key={module.moduleId} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(module.moduleId)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
              >
                <div className="flex-1 pr-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    <span className="text-indigo-600 mr-2">Module {moduleIndex + 1}:</span> {module.moduleName}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{module.noOfSessions} lessons</span>
                    <span className="mx-1">•</span>
                    <span>{module.moduleName}</span>
                  </div>
                </div>
                {expandedSections.includes(module.moduleId) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {expandedSections.includes(module.moduleId) && (
                <div className="bg-gray-50">
                  {module.sessions.map((session, sessionIndex) => {
                    const isSelected = selectedSession?.sessionId === session.sessionId
                    const isCompleted = sessionIndex < 3 // Example logic for completed sessions

                    return (
                      <div
                        key={session.sessionId}
                        className={`flex gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer ${isSelected ? "bg-indigo-50 hover:bg-indigo-50" : ""}`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <p
                            className={`text-sm font-medium leading-tight ${isSelected ? "text-indigo-700" : "text-gray-800"}`}
                          >
                            {session.sessionName}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.duration}</span>
                            </div>
                            {session.hasResources && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Resources</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next lesson button */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <Button className="w-full" size="lg">
            Continue to Next Lesson
          </Button>
        </div>
      </div>
    </div>
  )
}
