import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentCourses } from "./student-course";
import { StudentAssignments } from "./student-assignments";
import { StudentAnnouncements } from "./student-announcements";


export default function page() {
  return (
    <>
        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            <section>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.8</div>
                    <p className="text-xs text-muted-foreground">Out of 4.0</p>
                    <Progress value={95} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Currently enrolled</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Due this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <p className="text-xs text-muted-foreground">This semester</p>
                    <Progress value={98} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              </div>
            </section>

            <Tabs defaultValue="courses" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
              <TabsContent value="courses">
                <StudentCourses />
              </TabsContent>
              <TabsContent value="assignments">
                <StudentAssignments />
              </TabsContent>
              <TabsContent value="announcements">
                <StudentAnnouncements />
              </TabsContent>
            </Tabs>
          </div>
        </main>
    </>
  )
}
