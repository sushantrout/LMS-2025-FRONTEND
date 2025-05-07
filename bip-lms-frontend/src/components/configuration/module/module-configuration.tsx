"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  MoreHorizontal,
  Search,
  BookOpen,
  Clock,
  Users,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import QuillEditor from "@/components/editor/quill/quill-editor";
import { useRouter } from "next/navigation";
import { courseService } from "@/http/course-service";
import { Course } from "@/types/model/course-model";
import { Module } from "@/types/model/module-model";
import { moduleService } from "@/http/module-service";
export default function ModulesConfiguration({
  courseId,
}: {
  courseId: string;
}) {
  console.log("courseId===>", courseId);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const [course, setCourse] = useState<Course>();
  const [modules, setModules] = useState<Module[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (courseId) {
      moduleService.getModuleByCourseId(courseId).then((course) => {
        setModules(course.data.data);
      });
    }
  }, [courseId]);
  
  // Filter modules based on search query and status filter
  const filteredModules = Array.isArray(modules)
    ? modules.filter((module) => {
        const query = searchQuery?.toLowerCase() || "";
        const matchesSearch =
          module.name.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" || module.name === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  // Handle module form submission
  const handleModuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const action = submitter?.value; // "create" or "update"

    const moduleData: Module = {
      name: formData.get("title") as string,
      description: selectedModule?.description || "",
      trainerId: (formData.get("trainerId") as string) || "",
      sortOrder: 1,
      noOfSessions: formData.get("noOfSessions")
        ? Number(formData.get("noOfSessions"))
        : 0,
      sessions: selectedModule?.sessions || [],
      course: course || ({} as Course),
    };
    debugger;
    if (action === "update") {
      console.log("selectedModule.id===>", selectedModule.id);
      moduleService
        .updateModule(selectedModule.id, moduleData)
        .then((updated) => {
          const updatedModules = modules.map((m) =>
            m.id === updated.data.data.id ? updated.data.data : m
          );
          setModules(updatedModules);
          setIsModuleDialogOpen(false);
        });
    } else {
      moduleService.createModule(moduleData).then((created) => {
        setModules([...modules, created.data.data]);
        setIsModuleDialogOpen(false);
      });
    }
  };
  useEffect(() => {
    if (courseId) {
      courseService.getCourseDetail(courseId).then((course) => {
        setCourse(course.data.data);
        setModules(course.data.data.modules);
        console.log("course.data.data.modules===>", course.data.data.modules);
      });
    }
  }, [courseId]);
  // Calculate total duration from sessions
  const calculateTotalDuration = (sessions) => {
    const totalHours = sessions.reduce((total, session) => {
      const hours = Number.parseFloat(session.duration.split(" ")[0]);
      return total + hours;
    }, 0);

    return `${totalHours} hours`;
  };

  // Handle module deletion
  const handleDeleteModule = () => {
    setModules(modules.filter((m) => m.id !== selectedModule.id));
    setIsDeleteDialogOpen(false);
    setSelectedModule(null);
  };

  // Handle session deletion
  const handleDeleteSession = () => {
    const updatedModules = modules.map((module) => {
      if (module.id === selectedModule.id) {
        const updatedSessions = module.sessions.filter(
          (s) => s.id !== selectedSession.id
        );
        return {
          ...module,
          sessions: updatedSessions,
          totalDuration: calculateTotalDuration(updatedSessions),
        };
      }
      return module;
    });

    setModules(updatedModules);
    setIsDeleteSessionDialogOpen(false);
    setSelectedSession(null);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-500">
            Draft
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Module Management
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/configuration`)}
          >
            ← Back
          </Button>

          <Button
            onClick={() => {
              setSelectedModule(null);
              setIsModuleDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Module
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Modules</CardTitle>
              <CardDescription>
                Showing {filteredModules.length} modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Sessions
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Duration
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Enrolled
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No modules found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={module.name || "/placeholder.svg"}
                                alt={module.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{module.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {module.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {/* status */}
                        <TableCell>{getStatusBadge("active")}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {module.sessions.length}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          8 hours
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          24
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  router.push(
                                    `${courseId}/module/${module.id}`
                                  ); // Adjust the path to match your route structure
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  debugger;
                                  console.log("module===>", module);
                                  setSelectedModule(module);
                                  setIsModuleDialogOpen(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Module
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedModule(module);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Module
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Modules</CardTitle>
              <CardDescription>
                Modules that are currently active and available to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Sessions
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Duration
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Enrolled
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.filter((m) => m.name === "active").length ===
                  0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No active modules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModules
                      .filter((m) => m.name === "active")
                      .map((module) => (
                        <TableRow key={module.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={module.name || "/placeholder.svg"}
                                  alt={module.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{module.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {module.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {module.sessions.length}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            8 hours
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            24
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedModule(module);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="draft" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Draft Modules</CardTitle>
              <CardDescription>
                Modules that are still in draft mode and not visible to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Sessions
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Updated
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.filter((m) => m.name === "draft").length ===
                  0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No draft modules found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModules
                      .filter((m) => m.name === "draft")
                      .map((module) => (
                        <TableRow key={module.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={module.name || "/placeholder.svg"}
                                  alt={module.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{module.name}</div>
                                <div
                                  className="font-semibold mb-4 mt-2"
                                  dangerouslySetInnerHTML={{
                                    __html: module.description,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {module.sessions.length}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            Last day
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  debugger;
                                  setSelectedModule(module);
                                  setIsModuleDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit module</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedModule(module);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Form Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedModule ? "Edit Module" : "Add New Module"}
            </DialogTitle>
            <DialogDescription>
              {selectedModule
                ? "Update the details of this module."
                : "Fill in the details to create a new module."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleModuleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Module Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={selectedModule?.name || ""}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <QuillEditor
                  theme="snow"
                  value={selectedModule?.description || ""}
                  onChange={(e) =>
                    setSelectedModule((prev) => ({
                      ...prev,
                      description: e,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    defaultValue={selectedModule?.status || "draft"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Module Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModuleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                name="action"
                value={selectedModule ? "update" : "create"}
              >
                {selectedModule ? "Save Changes" : "Create Module"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Module Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Module</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this module? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{selectedModule?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedModule?.description}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteModule}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Session Confirmation Dialog */}
      <Dialog
        open={isDeleteSessionDialogOpen}
        onOpenChange={setIsDeleteSessionDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this session? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{selectedSession?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedSession?.description}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteSessionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSession}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
