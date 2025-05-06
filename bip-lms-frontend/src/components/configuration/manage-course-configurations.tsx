"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courseService } from "@/http/course-service";
import { courseCategoryService } from "@/http/course-catagory-service";
import { Course } from "@/types/model/course-model";
import { Module } from "@/types/model/module-model";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { moduleService } from "@/http/module-service";
import { sessionService } from "@/http/session-service";
import { Session } from "@/types/model/session-model";
import QuillEditor from "../editor/quill/quill-editor";
import { showSuccessToast } from "@/util/helpers/toast-helper";
import { useRouter } from "next/navigation";
import ModulesConfiguration from "./module/module-configuration";
import { User } from "@/types/model/user-model";
import { instructorService } from "@/http/instructors-service";

export default function ManageCoursePage({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course>({
    name:"",
    description: "",
    category: null,
    courseType: "",
    noOfModule: 0,
    maxRating: 0,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const[instructor, setInstructor] = useState<User[]>([]);

  const moduleDialogRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (courseId) {
      courseService.getCourseDetail(courseId).then((course) => {
        setCourse(course.data.data);
      });
      courseCategoryService.getCourseCategoryList().then((categories) => {
        setCategories(categories.data.data);
      });
      moduleService.getCourseList(courseId).then(async (modules) => {
        const moduleList = modules.data?.data || [];
        setModules(moduleList);
      });

      instructorService.getUserList().then((instructor) => {
        const instructorList = instructor.data?.data || [];
        setInstructor(instructorList);
      });
    }
  }, [courseId]);

  const handleSaveModule = (data: Module) => {
    console.log("data===>", data)
    data.course = course;
    console.log("module===>", module)
    moduleService.createModule(data).then((module) => {
      moduleDialogRef.current.onClose();
    });
  };

  const handleSaveCourse = (course: Course) => {
    debugger;
    console.log("Course Saved", course);
    courseService.updateCourse(course.id, course).then((course) => {
      showSuccessToast("Course updated successfully");
      router.push(`/configuration`);
    });
  };

  return (
    <div className="container py-4 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Course: {course.name}</h1>

      <Tabs defaultValue="course" className="w-full">
        <TabsList>
          <TabsTrigger value="course">Manage Course</TabsTrigger>
          <TabsTrigger value="modules">Manage Modules</TabsTrigger>
        </TabsList>

        {/* --- Manage Course Tab --- */}
        <TabsContent value="course">
          <Card className="mt-4">
            <CardContent className="space-y-4 pt-6">
              <div className="flex gap-4">
                <div className="w-9/12">
                  <Label>Course Title</Label>
                  <Input
                    placeholder="Enter course title"
                    onChange={(e) =>
                      setCourse((prevCourse) => ({
                        ...prevCourse,
                        name: e.target.value,
                      }))
                    }
                    value={course.name}
                  />
                </div>
                <div className="w-3/12">
                  <Label>Category</Label>
                  <Select
                    value={course?.category?.id}
                    onValueChange={(value) => {
                      setCourse((prevCourse) => ({
                        ...prevCourse,
                        category: { id: value },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-3/12">
                  <Label>Category</Label>
                  <Select
                    value={course?.category?.id}
                    onValueChange={(value) => {
                      setCourse((prevCourse) => ({
                        ...prevCourse,
                        category: { id: value },
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
              </div>

              <div>
                <Label>Description</Label>
                <QuillEditor theme="snow" value={course.description} onChange={(e) =>
                    setCourse((prevCourse) => ({
                      ...prevCourse,
                      description: e,
                    }))
                  } />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveCourse(course)}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <ModulesConfiguration />
        </TabsContent>
      </Tabs>

    </div>
  );
}
