"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import QuillEditor from "@/components/editor/quill/quill-editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Session, initialSession } from "@/types/model/session-model";
import { moduleService } from "@/http/module-service";
import { Module } from "@/types/model/module-model";
import { sessionService } from "@/http/session-service";
import { showSuccessToast } from "@/util/helpers/toast-helper";

// Updated schema
const moduleSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  sortOrder: z.coerce.number().min(1, "Sort order must be at least 1"),
  description: z.string().optional(),
  mode: z.string(),
  startTime: z.date().nullable().optional(),
  endTime: z.date().nullable().optional(),
  location: z.string().optional(),
  link: z.string().optional(),
  moduleId: z.string().min(1, "Module is required"),
});

type ModuleFormSchema = z.infer<typeof moduleSchema>;

interface ManageSessionModalProps {
  courseId: string;
  selectedSession: Session | null;
  isSessionModalOpen: boolean;
  setIsSessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getModulesByCourseId: () => void;
  setSelectedSession?: React.Dispatch<React.SetStateAction<Session | null>>;
}

export default function ManageSessionModal({
  courseId,
  isSessionModalOpen,
  setIsSessionModalOpen,
  getModulesByCourseId,
  selectedSession,
  setSelectedSession,
}: ManageSessionModalProps) {
  const [modules, setModules] = useState<Module[]>([]);

  const form = useForm<ModuleFormSchema>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      sortOrder: 1,
      description: "",
      mode: "ONLINE",
      startTime: null,
      endTime: null,
      location: "",
      link: "",
      moduleId: "",
    },
  });

  // Reset form when selectedSession changes
  useEffect(() => {
    const sessionData = selectedSession ?? initialSession;

    if (isSessionModalOpen) {
      form.reset({
        name: sessionData.name || "",
        sortOrder: sessionData.sortOrder || 1,
        description: sessionData.description || "",
        mode: sessionData.mode || "ONLINE",
        startTime: sessionData.startTime || null,
        endTime: sessionData.endTime || null,
        location: sessionData.location || "",
        link: sessionData.link || "",
        moduleId: sessionData.moduleId || "",
      });
    }
  }, [selectedSession, isSessionModalOpen]);

  // Fetch modules when courseId changes
  useEffect(() => {
    if (courseId) {
      moduleService.getModuleByCourseId(courseId).then((res) => {
        setModules(res.data.data);
      });
    }
  }, [courseId]);

  const onSubmit = async (values: ModuleFormSchema) => {
    console.log("Submitting...", values);

    try {
      if (selectedSession?.id) {
        await updateSession({ ...selectedSession, ...values });
      } else {
        await createSession(values);
      }
      setSelectedSession?.(null);
      setIsSessionModalOpen(false);
      getModulesByCourseId();

    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleClose = () => {
    setIsSessionModalOpen(false);
  };

  return (
    <Dialog open={isSessionModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedSession?.id ? "Edit Session" : "Create Session"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-x-4">
              {/* Module - 3/6 = 50% */}
              <div className="flex-[3] min-w-[200px]">
                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Module" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {modules.map((module) => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name - 2/6 = 33.33% */}
              <div className="flex-[2] min-w-[200px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Session name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sort Order - 1/6 = 16.67% */}
              <div className="flex-[1] min-w-[100px]">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Sort order"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="overflow-y-auto rounded border border-input">
                      <QuillEditor theme="snow" value={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-x-4">
              <div className="flex-1 min-w-[200px]">
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mode</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-100"> {/* Adjust width here */}
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent className="w-100"> {/* Match width here */}
                            <SelectItem value="ONLINE" className="text-base py-3 px-4">
                              ONLINE
                            </SelectItem>
                            <SelectItem value="OFFLINE" className="text-base py-3 px-4">
                              OFFLINE
                            </SelectItem>
                          </SelectContent>
                        </Select>

                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Session Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedSession?.id ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Dummy updateSession function – implement your API logic
const updateSession = async (session: Session) => {
  const res = await sessionService.updateSession(session.id!, session);
  console.log("Updated session:", res);
  showSuccessToast("Session updated successfully");
};

// Create session API logic
const createSession = async (session: ModuleFormSchema) => {
  const res = await sessionService.createSession(session);
  console.log("Created session:", res);
  showSuccessToast("Session created successfully");
};
