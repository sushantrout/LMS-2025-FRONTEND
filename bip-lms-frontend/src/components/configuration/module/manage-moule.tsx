import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Module, initialModule } from "@/types/model/module-model";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ManageCourseModalProps {
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  selectedModule: Module | null;
  isModuleModalOpen: boolean;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Zod schema
const moduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0, "Sort order must be a non-negative number"),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

export default function ManageModuleModal({
  setModules,
  selectedModule,
  isModuleModalOpen,
  setIsModuleModalOpen,
}: ManageCourseModalProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (selectedModule) {
      form.reset({
        name: selectedModule.name ?? "",
        description: selectedModule.description ?? "",
        sortOrder: selectedModule.sortOrder ?? 0,
      });
    } else {
      form.reset(); // Reset for new module
    }
  }, [selectedModule, form]);

  const onSubmit = (values: ModuleFormValues) => {
    const newModule: Module = {
      ...selectedModule,
      ...values,
    };

    setModules((prev) => {
      if (selectedModule?.id) {
        return prev.map((mod) => (mod.id === selectedModule.id ? newModule : mod));
      } else {
        return [...prev, { ...newModule, id: crypto.randomUUID() }];
      }
    });

    setIsModuleModalOpen(false);
  };

  return (
    <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedModule?.id ? "Edit Module" : "Create Module"}</DialogTitle>
          <DialogDescription>
            {selectedModule?.id
              ? "Update the module details below."
              : "Fill in the details to create a new module."}
          </DialogDescription>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Module description"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
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
                    <Input type="number" {...field} />
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
