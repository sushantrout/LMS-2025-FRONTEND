"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SessionDialog } from "./module/session-dialog"
import { ModuleDialog } from "./module/module-dialog"
import { Paperclip } from "lucide-react"
import { UploadNotesModal } from "./module/upload-notes"
import { courseService } from "@/http/course-service"
import { courseCategoryService } from "@/http/course-catagory-service"
import { useSearchParams } from "next/navigation"
import { Course } from "@/types/model/course-model"
import { Module } from "@/types/model/module-model"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { moduleService } from "@/http/module-service"
import { sessionService } from "@/http/session-service"
import { Event } from "@/types/model/session-model"
export default function ManageCoursePage({ courseId }: { courseId:  string  }) {
  //const searchParams = params.id;
  console.log(courseId)
  
  // const courseId = 
  const [isModuleDialogOpen, setModuleDialogOpen] = useState(false)
  const [isSessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [isUploadNotesModalOpen, setUploadNotesModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
 const [courseDescription, setCourseDescription] = useState("");
  const [course, setCourse] = useState<Course >({
    description: "",
    category : null,
    courseType : "",
    noOfModule: 0,
    maxRating : 0
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  useEffect(() => {
    courseService.getCourseDetail(courseId).then((course) => {
      setCourse(course.data.data);
      setCourseTitle(course.data.data.name || "");
      setCourseDescription(course.data.data.description || "");
      setSelectedCategory(course.data.data.category?.id || "");
    });
    courseCategoryService.getCourseCategoryList().then((categories) => {
      setCategories(categories.data.data)
    })
    moduleService.getCourseList(courseId).then(async (modules) => {
      const moduleList = modules.data.data;
    
      // Fetch sessions for each module in parallel
      const modulesWithSessions = await Promise.all(
        moduleList.map(async (module: Module) => {
          try {
            const sessionRes = await sessionService.getSessionListByModuleId(module.id);
            const sessions = sessionRes.data.data || [];
            return {
              ...module,
              sessions: sessions.map((session: Event) => ({
                ...session,
                // Add transformation if needed
              })),
            };
          } catch (error) {
            console.error(`Error fetching sessions for module ${module.id}`, error);
            return {
              ...module,
              sessions: [],
            };
          }
        })
      );
      console.log("modulesWithSessions===>", modulesWithSessions)
      setModules(modulesWithSessions);
    });

  }, [courseId])


  const handleSaveModule = (data: { name: string; description: string }) => {
    const module = { 
      name: data.name,
      description: data.description,
      course: course
    }
    moduleService.createModule( module).then((module) => {
    })
  }

  const handleSaveSession = (module: Module) => (data: { title: string; duration: string; videoUrl: string }) => {
    const session = { 
      title: data.title,
      duration: data.duration,
      videoUrl: data.videoUrl,
      moduleId: module.id,
      moduleName: module.name
    }
    sessionService.createSession(session).then((session) => {
    })
    // Save session logic here (e.g., API call)
  }

  const handleUploadNotes = (file: File | null) => {
    if (file) {
      console.log("Notes Uploaded for session:", selectedSession, file)
    } else {
      console.log("Notes removed for session:", selectedSession)
    }
    setUploadNotesModalOpen(false)
  }
  const handleSaveCourse = (course: Course) => {
    console.log("Course Saved", course)
    courseService.updateCourse(course.id, course).then((course) => {
      console.log("course ====>>>"+course)
    })
  }

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
              <div>
                <Label>Course Title</Label>
                <Input placeholder="Enter course title" onChange={(e) =>
      setCourse((prevCourse) => ({
        ...prevCourse,
        name: e.target.value,
      }))} value={course.name} />
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="Enter course description" onChange={(e) =>
      setCourse((prevCourse) => ({
        ...prevCourse,
        description: e.target.value,
      }))
    } value={course.description} />
              </div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger>
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
            
              <Button onClick={() => handleSaveCourse(course)}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Manage Modules Tab --- */}
        <TabsContent value="modules">
  <Card className="mt-4">
    <CardContent className="pt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Modules</h2>
        <Button onClick={() => setModuleDialogOpen(true)} variant="default">
          Add New Module
        </Button>
        <ModuleDialog
          open={isModuleDialogOpen}
          onClose={() => setModuleDialogOpen(false)}
          onSave={handleSaveModule}
        />
      </div>

      {/* Render each module and its sessions */}
      {modules.map((module,index) => (
        <div key={index} className="border rounded p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium"> Module {index + 1}: {module.name}</h3>
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
              onSave={handleSaveSession(module)}
            />
          </div>

          {Array.isArray(module.sessions) && module.sessions.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {module.sessions.map((session) => (
                <li
                  key={session.id}
                  className="flex justify-between items-center"
                >
                  <span>{session.name}</span>
                  <Paperclip
                    className="cursor-pointer text-muted-foreground"
                    onClick={() => {
                      setSelectedSession(session.name);
                      setUploadNotesModalOpen(true);
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
</TabsContent>
      </Tabs>

      {/* Upload Notes Modal */}
      <UploadNotesModal
        open={isUploadNotesModalOpen}
        sessionName={selectedSession}
        onClose={() => setUploadNotesModalOpen(false)}
        onSave={handleUploadNotes}
      />
    </div>
  )
}
