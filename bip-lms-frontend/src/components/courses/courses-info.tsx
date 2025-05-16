"use client";

import { ArrowLeft, BookAIcon, Clock, Star, Users, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { courseService } from "@/http/course-service";
import { CourseOverView } from "@/types/model/course-overview-model";
import { useRouter } from "next/navigation";
import { courseReviewService } from "@/http/course-review-service";
import {
  CourseReview,
  CourseReviewStats,
} from "@/types/model/course-review-model";
import ReviewList from "./review-list";
import CourseStats from "./course-stats";
import { getImageSrc } from "@/util/helpers/application-data-converter-util";
import { showSuccessToast } from "@/util/helpers/toast-helper";

export default function CourseDetailInfo({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [courseOverView, setCourseOverView] = useState<CourseOverView | null>(
    null
  );

  const [courseReviews, setCourseReviews] = useState<CourseReview[]>([]);
  const [courseStats, setCourseStats] = useState<CourseReviewStats>(
    {} as CourseReviewStats
  );

  const [enrollmentStatus, setEnrollmentStatus] = useState<false | null>(
    null
  );

  const getCourseData = () => {
    courseService.getCourseOverView(courseId).then((res) => {
      setCourseOverView(res?.data?.data);
    });

    courseService.getEnrollmentStatus(courseId).then((res) => {
      setEnrollmentStatus(res?.data?.data);
    });
  };

  const getCourseReviews = () => {
    courseReviewService.getCourseReviews(courseId).then((res) => {
      setCourseReviews(res?.data?.data);
    });
  };

  const getCourseReviewStats = () => {
    courseReviewService.getTotalRatingStatistics(courseId).then((res) => {
      setCourseStats(res?.data?.data);
    });
  };

  const enrollmentTheCourse = () => {
    courseService.enroll(courseId).then(res => {
      console.log(res.data);
      showSuccessToast("You've successfully enrolled in the course!");
    });
  }

  useEffect(() => {
    getCourseData();
    getCourseReviews();
    getCourseReviewStats();
  }, [courseId]);

  if (!courseOverView) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        <img
          src={courseOverView?.coverImage ? getImageSrc(courseOverView?.coverImage) : "/images/course/course-cover.avif"}
          alt={courseOverView?.courseName}
          className="w-full h-[200px] md:h-[200px] object-cover"
        />

        <div className="container relative z-20 px-4 pt-6 -mt-24 md:-mt-32">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white mb-6 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {courseOverView?.courseName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white mb-3">
            <div className="flex items-center gap-1 p-4">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{courseOverView.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5" />
              <span>{courseOverView?.studentCount} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{courseOverView?.duration} Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container px-4 py-1 font-sans text-sm">
        <div className={enrollmentStatus ? "grid grid-cols-1 lg:grid-cols-1 gap-8" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-1">
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
                <div className="space-y-6">
                  {courseOverView?.modules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      {/* Module Header */}
                      <div className="flex items-center gap-2 font-medium text-lg">
                        <BookAIcon className="h-5 w-5 text-blue-600" />
                        <span>{module?.moduleName}</span>
                      </div>

                      {/* Sessions under Module */}
                      {module?.sessions?.length > 0 ? (
                        <ul className="ml-6 list-disc space-y-1 text-sm text-gray-700">
                          {module.sessions.map((session, idx) => (
                            <li key={idx}>
                              <div className="flex flex-col">
                                <span className="font-semibold">
                                  {session.sessionName}
                                </span>
                                <span
                                  className="text-gray-500"
                                  dangerouslySetInnerHTML={{
                                    __html: session?.sessionDescription,
                                  }}
                                ></span>
                                <a
                                  href={session.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  Join Session
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ml-6 text-sm text-gray-500">
                          No sessions available for this module.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor">
                <h2 className="text-2xl font-semibold mb-4">
                  Meet Your Instructor
                </h2>
                {courseOverView?.instructors.map((instructor) => {
                  return (
                    <div className="flex flex-col md:flex-row gap-6 items-start mb-6" key={instructor?.id} >
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={getImageSrc(instructor?.profilePicture)}
                          alt={instructor?.fullName}
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
                          {instructor?.fullName}
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {instructor?.email}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {instructor?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="reviews">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-3/3 space-y-6">
                    <CourseStats courseStats={courseStats} />

                    <Separator />
                    <ReviewList courseReviews={courseReviews} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          {!enrollmentStatus &&
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-4">
                  {/* ${course?.duration} */}
                </div>
                <Button className="w-full mb-3 " onClick={() => enrollmentTheCourse()} >Enroll Now</Button>
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
                        </svg>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        }
        </div>
      </div>
    </div>
  );
}
