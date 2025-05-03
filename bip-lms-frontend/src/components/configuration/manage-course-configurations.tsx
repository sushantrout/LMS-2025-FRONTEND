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

export default function ManageCoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id
  const [isModuleDialogOpen, setModuleDialogOpen] = useState(false)
  const [isSessionDialogOpen, setSessionDialogOpen] = useState(false)
  const [isUploadNotesModalOpen, setUploadNotesModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleSaveModule = (data: { name: string; description: string }) => {
    console.log("Module Saved", data)
    // Save module logic here (e.g., API call)
  }

  const handleSaveSession = (data: { title: string; duration: string; videoUrl: string }) => {
    console.log("Session Saved", data)
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

  return (
    <div className="container py-4 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Course: {courseId}</h1>

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
                <Input placeholder="Enter course title" />
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="Enter course description" />
              </div>
              <div>
                <Label>Category</Label>
                <Input placeholder="e.g., Technical Skills, Leadership" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Duration</Label>
                  <Input placeholder="e.g., 4h 30m" />
                </div>
                <div className="flex-1">
                  <Label>Lessons</Label>
                  <Input type="number" placeholder="e.g., 10" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Manage Modules Tab --- */}
        <TabsContent value="modules">
          <Card className="mt-4">
            <CardContent className="pt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Modules</h2>
                <Button onClick={() => setModuleDialogOpen(true)} variant="default" className="">
                  Add New Module
                </Button>
                <ModuleDialog
                  open={isModuleDialogOpen}
                  onClose={() => setModuleDialogOpen(false)}
                  onSave={handleSaveModule}
                />
              </div>

              {/* Example module block */}
              <div className="border rounded p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Module 1: Introduction</h3>
                  <Button onClick={() => setSessionDialogOpen(true)} variant="default" className="">
                    Add New Session
                  </Button>
                  <SessionDialog
                    open={isSessionDialogOpen}
                    onClose={() => setSessionDialogOpen(false)}
                    onSave={handleSaveSession}
                  />
                </div>

                {/* Sessions with icon to upload notes */}
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li className="flex justify-between items-center">
                    <span>Session 1: Welcome</span>
                    <Paperclip
                      className="cursor-pointer text-muted-foreground"
                      onClick={() => {
                        setSelectedSession("Session 1: Welcome")
                        setUploadNotesModalOpen(true)
                      }}
                    />
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Session 2: Course Overview</span>
                    <Paperclip
                      className="cursor-pointer text-muted-foreground"
                      onClick={() => {
                        setSelectedSession("Session 2: Course Overview")
                        setUploadNotesModalOpen(true)
                      }}
                    />
                  </li>
                </ul>
              </div>
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
