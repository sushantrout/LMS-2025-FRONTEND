import { Course } from "@/types/model/course-model";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          src="/images/course/course-cover.avif"
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
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-yellow-500 font-medium gap-1">
            <div className="flex">
              <div className="flex items-center text-yellow-500 font-medium gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const fullStars = Math.floor(course.maxRating);
                    const hasHalfStar = course.maxRating - fullStars >= 0.5;

                    if (star <= fullStars) {
                      // Full star
                      return (
                        <Star
                          key={star}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      );
                    } else if (star === fullStars + 1 && hasHalfStar) {
                      // Half star
                      return (
                        <StarHalf
                          key={star}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      );
                    } else {
                      // Empty star
                      return (
                        <Star
                          key={star}
                          className="h-5 w-5 text-muted-foreground"
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>
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
