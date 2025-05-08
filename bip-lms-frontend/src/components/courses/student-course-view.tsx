"use client";
import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/model/course-model";
import { CourseOverView } from "@/types/model/course-overview-model";
import { courseService } from "@/http/course-service";

export default function StudentCourseView({ courseId }: { courseId: string }) {
    const [course, setCourse] = useState<CourseOverView | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await courseService.getCourseOverView(courseId);
                setCourse(response.data?.data || null);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            }
        };

        fetchData();
    }, [courseId]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
        );
    };

    if (!course) return <div className="p-8 text-center">Loading course...</div>;

    return (
        <div className="flex h-screen bg-white">
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

                {/* Tabs */}
                <div className="border-b">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="h-auto bg-transparent flex w-full justify-start overflow-x-auto">
                            {["overview", "q&a", "notes", "announcements", "reviews", "tools"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 text-gray-600 text-sm font-medium"
                                >
                                    {tab === "tools" ? "Learning tools" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="overview" className="p-4 m-0">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-2xl font-bold mb-4">{course.courseName}</h1>
                                <p className="text-gray-700 mb-6">{course.courseDescription}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="q&a" className="p-4 m-0">
                            <Input type="search" placeholder="Search all course questions" className="pr-10 border-gray-300" />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-[400px] flex flex-col h-full bg-white border-l border-gray-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-gray-800">Course content</h2>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto">
                    {course.modules.map((module) => (
                        <div key={module.moduleId} className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection(module.moduleId)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
                            >
                                <div className="flex-1 pr-2">
                                    <h3 className="text-sm font-medium text-gray-800">
                                        Section {module.moduleName}
                                    </h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <span>
                                            {module.noOfSessions}
                                        </span>
                                        <span className="mx-1">|</span>
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
                                    {module.sessions.map((session) => (
                                        <div key={session.sessionId} className="flex gap-3 px-4 py-3 hover:bg-gray-100">
                                            <Checkbox
                                                id={`session-${module.moduleId}-${session.sessionId}`}
                                                className="mt-0.5"
                                                checked={true}
                                            />
                                            <div className="space-y-1 flex-1">
                                                <label
                                                    htmlFor={`session-${module.moduleId}-${session.sessionId}`}
                                                    className="text-sm font-medium leading-tight cursor-pointer text-gray-800"
                                                >
                                                    {session.sessionName}
                                                </label>
                                                <div className="flex items-center gap-1 text-gray-500 text-xs">
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
                                                    <span>{session.duration}</span>
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
    );
}
