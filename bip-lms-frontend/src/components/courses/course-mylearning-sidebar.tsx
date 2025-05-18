import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  X,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CourseOverView } from "@/types/model/course-overview-model";
import { SessionOverview } from "@/types/model/session-overview-model";
export default function MyLearningSidebar({
  course,
  progress,
  toggleSection,
  expandedSections,
  selectedSession,
  setSelectedSession,
}: {
  course: CourseOverView;
  progress: number;
  toggleSection: (sectionId: string) => void;
  expandedSections: string[];
  selectedSession: SessionOverview;
  setSelectedSession: (session: SessionOverview) => void;
}) {
  return (
    <div className="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold text-gray-800">Course content</h2>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            {progress}% complete
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100 md:hidden"
          >
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
                  <span className="text-indigo-600 mr-2">
                    Module {moduleIndex + 1}:
                  </span>{" "}
                  {module.moduleName}
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
                  const isSelected =
                    selectedSession?.sessionId === session.sessionId;
                  const isCompleted = sessionIndex < 3; // Example logic for completed sessions

                  return (
                    <div
                      key={session.sessionId}
                      className={`flex gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                        isSelected ? "bg-indigo-50 hover:bg-indigo-50" : ""
                      }`}
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
                          className={`text-sm font-medium leading-tight ${
                            isSelected ? "text-indigo-700" : "text-gray-800"
                          }`}
                        >
                          {session.sessionName}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{session.duration}</span>
                          </div>
                          {/* {session.hasResources && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Resources</span>
                              </div>
                            )} */}
                        </div>
                      </div>
                    </div>
                  );
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
  );
}
