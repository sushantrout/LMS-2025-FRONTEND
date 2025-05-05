"use client";
import { ArrowLeft, Clock, Star, Users} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { courseService } from "@/http/course-service";
import { CourseOverView } from "@/types/model/course-overview-model";

export default function CourseDetailInfo({ courseId }: { courseId: string }) {
  const [courseOverView, setCourseOverView] = useState<CourseOverView | null>(
    null
  );

  useEffect(() => {
    courseService.getCourseOverView(courseId).then((res) => {
      console.log(res?.data?.data);
      setCourseOverView(res?.data?.data);
    });
  }, [courseId]);

  if (!courseOverView) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
      <img
        src={"/images/course/course-cover.avif?height=400&width=1200"}
        alt={courseOverView?.courseName}
        className="w-full h-[200px] md:h-[200px] object-cover"
      />

      <div className="container relative z-20 px-4 pt-6 -mt-24 md:-mt-32">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-white mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
        <Badge className={`mb-4 ml-2`}>
          {courseOverView?.courseName}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {courseOverView?.courseName}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-white mb-3">
          <div className="flex items-center gap-1 p-4">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">5.0</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-5 w-5" />
            <span>{courseOverView?.createdBy} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-5 w-5" />
            <span>{/* duration */}</span>
          </div>
        </div>
      </div>
    </div>

      {/* Course Content */}
      <div className="container px-4 py-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                  <div
                    className="font-semibold mb-4 mt-2"
                      dangerouslySetInnerHTML={{
                        __html: courseOverView?.courseDescription,
                      }}
                    />
              </TabsContent>

              <TabsContent value="curriculum">
                <h2 className="text-2xl font-semibold mb-4">
                  Course Curriculum
                </h2>
              </TabsContent>

              <TabsContent value="instructor">
                <h2 className="text-2xl font-semibold mb-4">
                  Meet Your Instructor
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={courseOverView?.courseName}
                    />
                    <AvatarFallback>
                      {courseOverView?.courseName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">
                      {courseOverView?.courseName}
                    </h3>
                    <p className="text-muted-foreground">
                      {courseOverView?.courseName}
                    </p>
                    <div className="flex items-center gap-4 my-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>
                          {/* {courseOverView?.maxRating} */} 5.0 Instructor
                          Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{courseOverView?.createdBy} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          <rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                          />
                        </svg>
                        <span>{courseOverView?.createdBy} Courses</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {courseOverView?.createdBy}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-5xl font-bold mb-2">
                        {/* {course.maxRating} */}
                      </div>
                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= 5
                                ? //   Math.floor(courseOverView?.maxRating)
                                  "fill-yellow-500 text-yellow-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-muted-foreground">Course Rating</div>
                      <div className="mt-1 font-medium">
                        {/* {course?.maxRating} */}
                        Reviews
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage =
                          rating === 5
                            ? 70
                            : rating === 4
                            ? 20
                            : rating === 3
                            ? 7
                            : rating === 2
                            ? 2
                            : 1;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                              <span>{rating}</span>
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </div>
                            <Progress
                              value={percentage}
                              className="h-2 flex-1"
                            />
                            <div className="w-12 text-right text-muted-foreground">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      {[
                        {
                          name: "Alex Johnson",
                          date: "2 weeks ago",
                          rating: 5,
                          comment:
                            "This course exceeded my expectations. The instructor explains complex concepts in a way that's easy to understand. Highly recommended!",
                        },
                        {
                          name: "Sarah Miller",
                          date: "1 month ago",
                          rating: 4,
                          comment:
                            "Great content and well-structured lessons. I would have liked more practical exercises, but overall it's a solid course.",
                        },
                        {
                          name: "David Chen",
                          date: "2 months ago",
                          rating: 5,
                          comment:
                            "The best course I've taken on this subject. The instructor is knowledgeable and engaging. I've already applied what I learned to my work.",
                        },
                      ].map((review, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {review.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {review.date}
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-4">
                  {/* ${course?.duration} */}
                </div>
                <Button className="w-full mb-3 ">Enroll Now</Button>
                <Button variant="outline" className="w-full mb-6">
                  Add to Wishlist
                </Button>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {/* {courseOverView?.duration} */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">
                      {/* {courseOverView?.lessons} */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">
                      {/* {courseOverView?.maxRating} */}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-medium">This course includes:</h3>
                  <div className="space-y-2">
                    {[
                      { icon: "video", text: "HD video lessons" },
                      { icon: "download", text: "Downloadable resources" },
                      { icon: "message-circle", text: "Community support" },
                      { icon: "award", text: "Completion certificate" },
                      { icon: "smartphone", text: "Mobile access" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          {item.icon === "video" && (
                            <path d="M22 8.5a2.5 2.5 0 0 0-3.5-2.3L18 6.5l-6 4V6.5l-1-.3a2.5 2.5 0 0 0-3.5 2.3v7a2.5 2.5 0 0 0 3.5 2.3l1-.3v-3.5l6 4 .5.3a2.5 2.5 0 0 0 3.5-2.3z" />
                          )}
                          {item.icon === "download" && (
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          )}
                          {item.icon === "message-circle" && (
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          )}
                          {/* {item.icon === "award" && <circle cx="12" cy="8" r="7\" /><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />} */}
                          {/* {item.icon === "smartphone" && <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />} */}
                        </svg>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
