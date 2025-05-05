"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SessionDialog } from "./module/session-dialog";
import ModuleDialog from "./module/module-dialog";
import { Edit, Paperclip } from "lucide-react";
import { UploadNotesModal } from "./module/upload-notes";
import { courseService } from "@/http/course-service";
import { courseCategoryService } from "@/http/course-catagory-service";
import { Course } from "@/types/model/course-model";
import { Module } from "@/types/model/module-model";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { moduleService } from "@/http/module-service";
import { sessionService } from "@/http/session-service";
import { Session } from "@/types/model/session-model";
import QuillEditor from "../editor/quill/quill-editor";
import { showSuccessToast } from "@/util/helpers/toast-helper";

export default function ManageCoursePage({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course>({
    name:"",
    description: "",
    category: null,
    courseType: "",
    noOfModule: 0,
    maxRating: 0,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const moduleDialogRef = useRef<any>(null);

  useEffect(() => {
    if (courseId) {
      courseService.getCourseDetail(courseId).then((course) => {
        setCourse(course.data.data);
      });
      courseCategoryService.getCourseCategoryList().then((categories) => {
        setCategories(categories.data.data);
      });
      moduleService.getCourseList(courseId).then(async (modules) => {
        const moduleList = modules.data?.data || [];
        setModules(moduleList);
      });
    }
  }, [courseId]);

  const handleSaveModule = (data: Module) => {
    data.course = course;
    moduleService.createModule(module).then((module) => {
      moduleDialogRef.current.onClose();
    });
  };

  const handleSaveCourse = (course: Course) => {
    debugger;
    console.log("Course Saved", course);
    courseService.updateCourse(course.id, course).then((course) => {
      showSuccessToast("Course updated successfully");
    });
  };

  return (
    <div className="container py-4 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Course: {course.name}</h1>

      <Tabs defaultValue="course" className="w-full">
        <TabsList>
          <TabsTrigger value="course">Manage Course</TabsTrigger>
          <TabsTrigger value="modules">Manage Modules</TabsTrigger>
        </TabsList>

        {/* --- Manage Course Tab --- */}
        <TabsContent value="course">
          <Card className="mt-4">
            <CardContent className="space-y-4 pt-6">
              <div className="flex gap-4">
                <div className="w-9/12">
                  <Label>Course Title</Label>
                  <Input
                    placeholder="Enter course title"
                    onChange={(e) =>
                      setCourse((prevCourse) => ({
                        ...prevCourse,
                        name: e.target.value,
                      }))
                    }
                    value={course.name}
                  />
                </div>
                <div className="w-3/12">
                  <Label>Category</Label>
                  <Select
                    value={course?.category?.id}
                    onValueChange={(value) => {
                      setCourse((prevCourse) => ({
                        ...prevCourse,
                        category: { id: value },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <QuillEditor theme="snow" value={course.description} onChange={(e) =>
                    setCourse((prevCourse) => ({
                      ...prevCourse,
                      description: e,
                    }))
                  } />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveCourse(course)}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Manage Modules Tab --- */}
        <TabsContent value="modules">
          <Card className="mt-4">
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Modules</h2>

                <ModuleDialog
                  ref={moduleDialogRef}
                  onClose={() => {}}
                  onSave={handleSaveModule}
                />
              </div>

              {/* Render each module and its sessions */}
              {modules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  index={index}
                  onEdit={() => {
                    moduleDialogRef.current.onOpen(module);
                  }}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Notes Modal */}
    </div>
  );
}

const ModuleCard = ({
  module,
  index,
  onEdit,
}: {
  module: Module;
  index: number;
  onEdit: (module) => void;
}) => {
  const [isSessionDialogOpen, setSessionDialogOpen] = useState(false);
  const handleSaveSession = (session: Session) => {
    session.moduleId = module?.id;
    sessionService.createSession(session).then((session) => {
      setSessionDialogOpen(false);
    });
  };
  return (
    <div className="border rounded p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <h3 className="font-medium">
            {" "}
            Module {index + 1}: {module.name}
          </h3>
          <Edit onClick={() => onEdit(module)} />
        </div>
        <Button
          onClick={() => {
            setSessionDialogOpen(true);
          }}
          variant="default"
        >
          Add New Session
        </Button>
        <SessionDialog
          open={isSessionDialogOpen}
          onClose={() => setSessionDialogOpen(false)}
          onSave={(session) => handleSaveSession(session)}
        />
      </div>

      {Array.isArray(module.sessions) && module.sessions.length > 0 ? (
        <SessionCard module={module} />
      ) : (
        <p className="text-sm text-muted-foreground">No sessions yet.</p>
      )}
    </div>
  );
};

const SessionCard = ({ module }: { module: Module }) => {
  return (
    <>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        {module.sessions.map((session) => (
          <SessionComponent key={session.id} session={session} />
        ))}
      </ul>
    </>
  );
};

const SessionComponent = ({ session }: { session: Session }) => {
  const [isUploadNotesModalOpen, setUploadNotesModalOpen] = useState(false);
  const handleUploadNotes = (file: File | null) => {
    if (file) {
      console.log("Notes Uploaded for session:", session, file);
    } else {
      console.log("Notes removed for session:", session);
    }
    setUploadNotesModalOpen(false);
  };
  return (
    <>
      <UploadNotesModal
        open={isUploadNotesModalOpen}
        sessionName={session?.name}
        onClose={() => setUploadNotesModalOpen(false)}
        onSave={handleUploadNotes}
      />
      <li key={session.id} className="flex justify-between items-center">
        <span>{session.name}</span>
        <Paperclip
          className="cursor-pointer text-muted-foreground"
          onClick={() => {
            setUploadNotesModalOpen(true);
          }}
        />
      </li>
    </>
  );
};
