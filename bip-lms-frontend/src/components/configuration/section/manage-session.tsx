"use client";

import { useEffect } from "react";
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
import { useForm, useWatch } from "react-hook-form";
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
import { sessionService } from "@/http/session-service";
import { showSuccessToast } from "@/util/helpers/toast-helper";
import { Module } from "@/types/model/module-model";

// Schema
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
  selectedSession: Session | null;
  isSessionModalOpen: boolean;
  setIsSessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSession?: React.Dispatch<React.SetStateAction<Session | null>>;
  modules: Module[];
  setModules?: React.Dispatch<React.SetStateAction<Module[]>>; // <-- added
}

export default function ManageSessionModal({
  isSessionModalOpen,
  setIsSessionModalOpen,
  selectedSession,
  setSelectedSession,
  modules,
  setModules, // <-- added
}: ManageSessionModalProps) {
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

  const mode = useWatch({
  control: form.control,
  name: "mode",
  })

  const onSubmit = async (values: ModuleFormSchema) => {
    try {
      if (selectedSession?.id) {
        const updated = await updateSession({ ...selectedSession, ...values });
        if (setModules) {
          setModules((prevModules) =>
            prevModules.map((mod) =>
              mod.id === updated.moduleId
                ? {
                    ...mod,
                    sessions: mod.sessions.map((sess) =>
                      sess.id === updated.id ? updated : sess
                    ),
                  }
                : mod
            )
          );
        }
      } else {
        const created = await createSession(values);
        if (setModules) {
          setModules((prevModules) =>
            prevModules.map((mod) =>
              mod.id === created.moduleId
                ? {
                    ...mod,
                    sessions: [...(mod.sessions || []), created],
                  }
                : mod
            )
          );
        }
      }

      setSelectedSession?.(null);
      setIsSessionModalOpen(false);
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleClose = () => {
    setIsSessionModalOpen(false);
  };

  return (
    <Dialog open={isSessionModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedSession?.id ? "Edit Session" : "Create Session"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-x-4">
              {!selectedSession?.id && (
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
                              {(modules ?? []).map((module) => (
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
              )}

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
                          <SelectTrigger className="w-100">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent className="w-100">
                            <SelectItem value="ONLINE">ONLINE</SelectItem>
                            <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {mode === "OFFLINE" && <div className="flex-1 min-w-[200px]">
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
              </div>}
              {mode === "ONLINE" && <div className="flex-1 min-w-[200px]">
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
              </div>}
            </div>

            

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

// Utility functions
const updateSession = async (session: Session): Promise<Session> => {
  const res = await sessionService.updateSession(session.id!, session);
  showSuccessToast("Session updated successfully");
  return res.data?.data;
};

const createSession = async (session: ModuleFormSchema): Promise<Session> => {
  const res = await sessionService.createSession(session);
  showSuccessToast("Session created successfully");
  return res.data?.data;
};
