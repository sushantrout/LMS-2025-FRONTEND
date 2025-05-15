import { Course } from "@/types/model/course-model";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Duration } from "./course-duration";
import RatingStar from "../ui/rating-star";
import { getImageSrc } from "@/util/helpers/application-data-converter-util";

export default function CourseCard({
  course,
  type,
  setSelectedCourse,
  setOpenCourseModal,
}: {
  course: Course;
  type: "catalog" | "configuration";
  setSelectedCourse?:any,
  setOpenCourseModal?:any
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="relative">
        <img
          src={course?.coverImage ? getImageSrc(course?.coverImage) : "/images/course/course-cover.avif"}
          alt={course.name}
          className="aspect-video w-full object-cover"
        />
        <Badge className="absolute right-3 top-3">
          {course.category?.name}
        </Badge>
      </div>
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-xl font-semibold">{course.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription}
        </p>
      </div>
      <div className="mt-auto p-4 pt-0">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <RatingStar rating={course.rating} />
          </div>
          <div className="flex items-center text-yellow-500 font-medium gap-1">
            <Clock className="h-4 w-4" />
            <span>
              <Duration duration={Number(course.duration)} />
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButtons type={type} course={course} setSelectedCourse={setSelectedCourse} setOpenCourseModal={setOpenCourseModal}/>
        </div>
      </div>
    </div>
  );
}

const ActionButtons = ({
  type,
  course,
  setSelectedCourse,
  setOpenCourseModal,
}: {
  type: "catalog" | "configuration";
  course: Course;
  setSelectedCourse?: (course: Course) => void;
  setOpenCourseModal?: (open: boolean) => void;
}) => {
  if (type === "catalog") {
    return (
      <Link href={`/courses/${course.id}`} className="flex-1">
        <Button className="w-full">View Course</Button>
      </Link>
    );
  }

  if (type === "configuration") {
    return (
      <>
        <Button
          className="flex-1"
          onClick={() => {
            console.log("Edit course", setOpenCourseModal);
            setSelectedCourse(course);
            setOpenCourseModal(true);
          }}
        >
          Edit
        </Button>
        <Link href={`/configuration/manage-course/${course.id}`} className="flex-1">
          <Button className="w-full">Manage Modules</Button>
        </Link>
      </>
    );
  }

  return null;
};
