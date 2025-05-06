import { Course } from "@/types/model/course-model";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Duration } from "./course-duration";
import RatingStar from "../ui/rating-star";

export default function CourseCard({
  course,
  type,
}: {
  course: Course;
  type: "catalog" | "configuration";
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="relative">
        <img
          src={course.coverImage ? `data:${course?.coverImage?.contentType};base64,${course?.coverImage?.imageInByteArray}` : "/images/course/course-cover.avif"}
          alt={course.name}
          className="aspect-video w-full object-cover"
        />
        <Badge className="absolute right-3 top-3 ">
          {course.category?.name}
        </Badge>
      </div>
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-xl font-semibold">{course.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </div>
      <div className="mt-auto p-4 pt-0">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
          <div className="flex">
              <RatingStar rating={course.maxRating} />
            </div>
          </div>
          <div className="flex items-center text-yellow-500 font-medium gap-1">
            
            <Clock className="h-4 w-4" />
            <span>
              <Duration duration={Number(course.duration)} />
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton type={type} course={course} />
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({
  type,
  course,
}: {
  type: "catalog" | "configuration";
  course: Course;
}) => {
  if (type === "configuration") {
    return (
      <Link href={`/courses/${course.id}`} className="flex-1">
        <Button className="w-full">View Course</Button>
      </Link>
    );
  }
  if (type === "catalog") {
    return (
      <Link
        href={`/configuration/manage-course/${course.id}`}
        className="flex-1"
      >
        <Button className="w-full">Manage</Button>
      </Link>
    );
  }
};
