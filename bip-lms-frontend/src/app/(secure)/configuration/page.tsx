"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { courseService } from "@/http/course-service";
import { Course, initialFormData } from "@/types/model/course-model";
import { courseCategoryService } from "@/http/course-category-service";
import { Category } from "@/types/model/category-model";
import CourseCard from "@/components/courses/course-card";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import { instructorService } from "@/http/instructors-service";
import { MultiSelect } from "@/components/ui/multi-select";
import QuillEditor from "@/components/editor/quill/quill-editor";
import { User } from "@/types/model/user-model";


export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseCategories, setCourseCategories] = useState<Category[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState<Course>(initialFormData);
  const[instructors, setInstructors] = useState<User[]>([]);

  const getCourses = ()=> {
    courseService.getCourseList().then((res) => {
      setCourses(res?.data?.data);
    });
  };

  const getCourseCategory = () => {
    courseCategoryService.getCourseCategoryList().then((res) => {
      setCourseCategories(res?.data?.data);
    });
  };

  const getInstructors = () => {
    instructorService.getUserList().then((instructor) => {
            const instructorList = instructor.data?.data?.data || [];
            setInstructors(instructorList);
          }
    );
  }

  useEffect(() => {
    getCourses();
    getCourseCategory();
    getInstructors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    const category = value? {id: value} : null;
    setFormData((prev) => ({ ...prev, category: category}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    courseService.createCourse(formData).then((res) => {
      console.log(res);
      showSuccessToast("Course created successfully!");
      setCourses((prev) => [formData, ...prev]);
      setFormVisible(false);
      setFormData(initialFormData);
    }).catch(error => {
      console.error("Error creating course:", error);
      showErrorToast("Failed to create course. Please try Again.");
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Course Catalog
            </h1>
            <p className="text-muted-foreground">
              Discover and enroll in training courses to develop your skills
            </p>
          </div>
          <Button onClick={() => setFormVisible((prev) => !prev)}>
            {formVisible ? "Cancel" : "Create Course"}
          </Button>
        </div>

        {formVisible && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border p-6 bg-card shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">Create a New Course</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
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
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="maxRating"
                  name="maxRating"
                  type="number"
                  step="0.1"
                  value={formData.maxRating}
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
                <Label>Instructers</Label>
                <MultiSelect
                  options={instructors}
                  values={formData.instructors}
                  optionLabel="fullName"
                  optionValue="id"
                  placeholder="Select instructors"
                  onChange={(values) => setFormData((prev) => ({ ...prev, instructors: values }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <QuillEditor className="" theme="snow" value={formData.description} onChange={(e) =>
                  setFormData((prevCourse) => ({
                    ...prevCourse,
                    description: e,
                  }))
                } />
            </div>

            <div className="space-y-2">
            <Button type="submit" className="w-full">
              Create Course
            </Button>
            </div>
          </form>
        )}

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for courses..."
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <CourseGrid courses={courses} />
      </main>
    </div>
  );
}

function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} type="catalog" />
      ))}
    </div>
  );
}


