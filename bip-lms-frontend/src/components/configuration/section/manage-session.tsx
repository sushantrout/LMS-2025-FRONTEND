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

const moduleSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  sortOrder: z.number().min(1, "Sort order must be at least 1"),
  trainer: z.string().min(1, "Instructor is required"),
  description: z.string().optional(),
  mode: z.string().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  location: z.string().optional(),
  link: z.string().optional(),
});

interface ManageSessionModalProps {
  isSessionModalOpen: boolean;
  setIsSessionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: string;
  getModulesByCourseId: () => void;
  selectedSession: Session | null;
}

export default function ManageSessionModal({
  courseId,
  isSessionModalOpen,
  setIsSessionModalOpen,
  getModulesByCourseId,
  selectedSession,
}: ManageSessionModalProps) {
  const sessionData = selectedSession ?? initialSession;

  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: sessionData.name || "",
      sortOrder: sessionData.sortOrder || 1,
      description: sessionData.description || "",
      mode: sessionData.mode || "ONLINE",
      startTime: sessionData.startTime || null,
      endTime: sessionData.endTime || null,
      location: sessionData.location || "",
      link: sessionData.link || "",
    },
  });

  const [modules, setModules] = useState<Module[]>([]);

  // Fetch instructors and course details when courseId changes
  useEffect(() => {
    if (courseId) {
      moduleService.getModuleByCourseId(courseId).then((res) => {
        setModules(res.data.data);
      });
    }
  }, [courseId]);

  const onSubmit = async (values: Session) => {
    // Here, you will handle either creating or updating a session
    // Example: API call to save session
    if (selectedSession?.id) {
      // Update session
      updateSession(values);
    } else {
      // Create new session
      createSession(values);
    }

    setIsSessionModalOpen(false);
    getModulesByCourseId(); // Refresh modules list
  };

  const handleClose = () => {
    setIsSessionModalOpen(false);
  };

  return (
    <Dialog open={isSessionModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedSession?.id ? "Edit Session" : "Create Session"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Sort order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONLINE">ONLINE</SelectItem>
                        <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    {/* <Input type="datetime-local" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    {/* <Input type="datetime-local" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

const updateSession = async (session: Session) => {
  // Replace with actual API call to update session
};

const createSession = async (session: Session) => {
  // Replace with actual API call to create session
};
