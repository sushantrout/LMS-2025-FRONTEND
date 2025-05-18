"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { courseService } from "@/http/course-service";
import type { CourseOverView } from "@/types/model/course-overview-model";
import type { SessionOverview } from "@/types/model/session-overview-model";
import { questionService } from "@/http/question-service";
import type { Question } from "@/types/model/question-model";

import { AssessmentContent } from "./assessment-content";
import CourseLoader from "./course-loader";
import CourseVideoView from "./course-video-view";
import MyLearningSidebar from "./course-mylearning-sidebar";
import CommentForm from "./course-comment-form";

export default function StudentCourseView({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<CourseOverView | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<SessionOverview | null>(null);
  const [progress, setProgress] = useState(42); // Example progress percentage

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
    };

    fetchData();
  }, [courseId]);

  const getQuestionDetail = () =>
    questionService
      .getQuestioner(selectedSession.sessionId)
      .then((quiestionDetail) => {
        console.log(quiestionDetail.data.data);
        setQuestions(quiestionDetail?.data?.data);
      });

  useEffect(() => {
    if (selectedSession) {
      getQuestionDetail();
    }
  }, [selectedSession]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!course) {
    return <CourseLoader />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Video View */}
        <CourseVideoView selectedSession={selectedSession} />

        {/* Tabs */}
        <div className="border-b bg-white flex-grow overflow-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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

            <TabsContent value="Overview" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedSession?.sessionName || "Course Overview"}
                  </h2>

                  {selectedSession && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedSession.sessionDescription ||
                          "<p>No description available for this lesson. Select another lesson to view its content.</p>",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Q&A" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  {questions && questions.length > 0 ? (
                    <AssessmentContent questions={questions} />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">
                          {selectedSession
                            ? "No questions available for this lesson."
                            : "Select a lesson to view its questions."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Comments" className="p-6 m-0">
              <div className="max-w-2xl mx-auto">
                <CommentForm courseId={courseId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar */}
      <MyLearningSidebar
        course={course}
        progress={progress}
        toggleSection={toggleSection}
        expandedSections={expandedSections}
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
      />
    </div>
  );
}
