import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function StudentCourses() {
  const courses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Alan Turing",
      progress: 65,
      credits: 3,
      status: "In Progress",
    },
    {
      id: "MATH201",
      name: "Calculus II",
      instructor: "Dr. Katherine Johnson",
      progress: 78,
      credits: 4,
      status: "In Progress",
    },
    {
      id: "ENG102",
      name: "English Composition",
      instructor: "Prof. Jane Austen",
      progress: 92,
      credits: 3,
      status: "In Progress",
    },
    {
      id: "PHYS101",
      name: "Physics I",
      instructor: "Dr. Richard Feynman",
      progress: 45,
      credits: 4,
      status: "In Progress",
    },
    {
      id: "HIST105",
      name: "World History",
      instructor: "Dr. Howard Zinn",
      progress: 70,
      credits: 3,
      status: "In Progress",
    },
  ]

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  {course.id} • {course.instructor}
                </CardDescription>
              </div>
              <Badge>{course.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1 text-sm">
              <span>Course Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
            <div className="mt-2 text-sm text-muted-foreground">{course.credits} credit hours</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}