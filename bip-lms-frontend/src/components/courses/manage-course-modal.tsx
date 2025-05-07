import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MultiSelect } from "../ui/multi-select";
import QuillEditor from "../editor/quill/quill-editor";
import { Button } from "../ui/button";
import { courseCategoryService } from "@/http/course-catagory-service";
import { Category } from "@/types/model/category-model";
import { User } from "@/types/model/user-model";
import { Course, initialCourseFormData } from "@/types/model/course-model";
import { instructorService } from "@/http/instructors-service";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import { courseService } from "@/http/course-service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Define props type
interface ManageCourseModalProps {
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourse: Course | null;
  isCourseModalOpen: boolean;
  setIsCourseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ManageCourseModal({
  setCourses,
  selectedCourse,
  isCourseModalOpen,
  setIsCourseModalOpen,
}: ManageCourseModalProps) {
  const [formData, setFormData] = useState<Course>(initialCourseFormData);
  const [file, setFile] = useState<File | null>(null);
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    const category = value ? { id: value } : null;
    setFormData((prev) => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const multipartForm = new FormData();
    if (file) {
      multipartForm.append("file", file);
    }
    multipartForm.append(
      "formData",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    try {
      let response;
      if (selectedCourse) {
        response = await courseService.updateCourse(
          selectedCourse.id,
          multipartForm
        );
        showSuccessToast("Course updated successfully!");
        setCourses((prev) =>
          prev.map((course) =>
            course.id === selectedCourse.id ? response.data.data : course
          )
        );
      } else {
        response = await courseService.createCourse(multipartForm);
        showSuccessToast("Course created successfully!");
        setCourses((prev) => [response.data.data, ...prev]);
      }

      setFormData(initialCourseFormData);
      setFile(null);
      setIsCourseModalOpen(false);
    } catch (error) {
      console.error("Error saving course:", error);
      showErrorToast("Failed to save course. Please try again.");
    }
  };

  const getCourseCategory = () => {
    courseCategoryService.getCourseCategoryList().then((res) => {
      setCourseCategories(res?.data?.data);
    });
  };

  const getInstructors = () => {
    instructorService.getUserList().then((res) => {
      const instructorList = res.data?.data?.data || [];
      setInstructors(instructorList);
    });
  };

  useEffect(() => {
    getCourseCategory();
    getInstructors();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      setFormData(selectedCourse);
    } else {
      setFormData(initialCourseFormData);
    }
  }, [selectedCourse]);

  return (
    <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCourse ? "Edit Course" : "Add New Course"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border p-6 bg-card shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.category?.id || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {courseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instructors</Label>
              <MultiSelect
                options={instructors}
                values={formData.instructors}
                optionLabel="fullName"
                optionValue="id"
                placeholder="Select instructors"
                onChange={(values) =>
                  setFormData((prev) => ({ ...prev, instructors: values }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Course Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <QuillEditor
              theme="snow"
              value={formData.description}
              onChange={(e) =>
                setFormData((prevCourse) => ({
                  ...prevCourse,
                  description: e,
                }))
              }
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCourseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedCourse ? "Save Changes" : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
