'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Clock, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Label } from "@/components/ui/label"
  import { Input } from "@/components/ui/input"
  import { Textarea } from "@/components/ui/textarea"
import { moduleService } from '@/http/module-service';
import { sessionService } from '@/http/session-service';
export default function ModuleSessionDetails({ moduleId }: { moduleId: string }) {
    const router = useRouter();
    console.log("moduleId===>", moduleId);
    const searchParams = useSearchParams();
    const [selectedSession, setSelectedSession] = useState(null)
    const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
    const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] = useState(false)
  
    const [module, setModule] = useState<any>(null); // Replace `any` with your Module type
    useEffect(() => {
      if (moduleId) {
        moduleService.getModuleById(moduleId).then((module) => {
          setModule(module.data.data);
        });
      }
    }, [moduleId]);
    

  
    if (!module) return <div className="p-6">Loading module...</div>;
    const handleSessionSubmit = (e) => {    
        setIsSessionDialogOpen(false)
      }
      const handleDeleteSession = () => {
        setIsDeleteSessionDialogOpen(false)
        setSelectedSession(null)
      }
    return (
      <div >
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Module Details</h1>
          <p className="text-muted-foreground">View and manage the details of this module and its sessions.</p>
  
          <ScrollArea className="h-auto max-h-[75vh] pr-4">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={module.thumbnail || '/placeholder.svg'}
                    alt={module.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{module.title}</h3>
                    
                  </div>
                  <p className="text-muted-foreground mt-1">{module.description}</p>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sessions</p>
                    <p className="text-xl">{module.sessions.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-xl">{module.totalDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enrolled</p>
                    <p className="text-xl">{module.enrolledCount}</p>
                  </div>
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Sessions</h3>
                  <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSession(null)
                        setIsSessionDialogOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Session
                    </Button>
                </div>
  
                {module.sessions.length === 0 ? (
                  <div className="text-center py-8 border rounded-md">
                    <p className="text-muted-foreground">No sessions added yet.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => router.push(`/sessions/new?moduleId=${module.id}`)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {module.sessions.map((session, index) => (
                      <div key={session.id} className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${session.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-500'
                                }`}
                            >
                              {session.completed ? '✓' : index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{session.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {session.duration}
                                </div>
                                <div>Instructor: {session.instructor}</div>
                              </div>
                              <p className="text-sm mt-2">{session.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                          <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedSession(session)
                                  setIsSessionDialogOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit session</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setSelectedSession(session)
                                  setIsDeleteSessionDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete session</span>
                              </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
                
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => router.push(`/configuration/manage-course/${courseId}`)}>
              Back
            </Button>
            
          </div>
          <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedSession ? "Edit Session" : "Add New Session"}</DialogTitle>
            <DialogDescription>
              {selectedSession ? "Update the details of this session." : "Fill in the details to create a new session."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSessionSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Session Title</Label>
                <Input id="title" name="title" defaultValue={selectedSession?.title || ""} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={selectedSession?.description || ""}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" defaultValue={selectedSession?.duration || "1 hour"} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" name="instructor" defaultValue={selectedSession?.instructor || ""} required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedSession ? "Save Changes" : "Add Session"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteSessionDialogOpen} onOpenChange={setIsDeleteSessionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{selectedSession?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedSession?.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSessionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSession}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    );
}
