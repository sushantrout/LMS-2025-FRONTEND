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
import { initialModule, Module } from "@/types/model/module-model";
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
import { courseService } from "@/http/course-service";
import { User } from "@/types/model/user-model";
import { moduleService } from "@/http/module-service";
import { Course } from "@/types/model/course-model";

interface ManageCourseModalProps {
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  selectedModule: Module | null;
  isModuleModalOpen: boolean;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: string;
}

// Zod schema
const moduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0, "Sort order must be a non-negative number"),
  trainer: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

export default function ManageModuleModal({
  courseId,
  setModules,
  selectedModule,
  isModuleModalOpen,
  setIsModuleModalOpen,
}: ManageCourseModalProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {},
  });

  const [instructors, setInstructors] = useState<User[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (selectedModule) {
      form.reset({
        name: selectedModule.name ?? "",
        description: selectedModule.description ?? "",
        sortOrder: selectedModule.sortOrder ?? 0,
        trainer: selectedModule.trainer?.id ?? "",
      });
    } else {
      form.reset();
    }

    if (courseId) {
      courseService.getCourseDetail(courseId).then((res) => {
        const courseData = res?.data?.data;
        setCourse(courseData);
        setInstructors(courseData?.instructors ?? []);
      });
    }
  }, [selectedModule, form, courseId]);

  const onSubmit = (values: ModuleFormValues) => {
    const newModule: Module = {
      ...selectedModule,
      ...values,
      course: course!,
      trainer: values.trainer ? { id: values.trainer } : undefined,
    };

    setModules((prev) => {
      if (selectedModule?.id) {
        return prev.map((mod) => (mod.id === selectedModule.id ? newModule : mod));
      } else {
        return [...prev, { ...newModule, id: crypto.randomUUID() }];
      }
    });

    moduleService.createModule(newModule).then(() => {
      setIsModuleModalOpen(false);
    });
  };

  return (
    <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedModule?.id ? "Edit Module" : "Create Module"}</DialogTitle>
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
                    <Input placeholder="Module name" {...field} />
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
              name="trainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {instructors.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModuleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedModule?.id ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
