// File: ManageModuleModal.tsx

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
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";

interface ManageCourseModalProps {
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  selectedModule: Module | null;
  setSelectedModule: React.Dispatch<React.SetStateAction<Module | null>>;
  isModuleModalOpen: boolean;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: string;
  getModulesByCourseId: () => void;
}

const moduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0, "Sort order must be a non-negative number"),
  trainer: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

export default function ManageModuleModal({
  courseId,
  selectedModule,
  isModuleModalOpen,
  setIsModuleModalOpen,
  getModulesByCourseId,
  setSelectedModule,
}: ManageCourseModalProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
      trainer: "",
    },
  });

  const [instructors, setInstructors] = useState<User[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

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
      setSelectedModule(initialModule);
    }
  }, [selectedModule, form]);

  useEffect(() => {
    if (courseId) {
      courseService.getCourseDetail(courseId).then((res) => {
        const courseData = res?.data?.data;
        setCourse(courseData);
        setInstructors(courseData?.instructors ?? []);
      });
    }
  }, [courseId]);

  const onSubmit = async (values: ModuleFormValues) => {
    const newModule: Module = {
      ...selectedModule,
      ...values,
      course: course!,
      trainer: values.trainer ? { id: values.trainer } : undefined,
      id: selectedModule?.id || initialModule.id,
    };


    if (selectedModule?.id) {
      await moduleService.updateModule(selectedModule.id, newModule);
      showSuccessToast("Module updated successfully");
    } else {
      await moduleService.createModule(newModule);
      showSuccessToast("Module created successfully");
    }

    setIsModuleModalOpen(false);
    getModulesByCourseId();
    setSelectedModule(null);
  };

  const handleClose = () => {
    setIsModuleModalOpen(false);
    setSelectedModule(null);
  };

  return (
    <Dialog open={isModuleModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedModule?.id ? "Edit Module" : "Create Module"}
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
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedModule?.id ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
