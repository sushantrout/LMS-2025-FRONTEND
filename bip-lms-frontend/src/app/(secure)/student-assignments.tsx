import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

export function StudentAssignments() {
  const assignments = [
    {
      id: 1,
      title: "Research Paper",
      course: "ENG102",
      dueDate: "May 20, 2025",
      daysLeft: 4,
      status: "Pending",
    },
    {
      id: 2,
      title: "Problem Set 5",
      course: "MATH201",
      dueDate: "May 18, 2025",
      daysLeft: 2,
      status: "Pending",
    },
    {
      id: 3,
      title: "Lab Report",
      course: "PHYS101",
      dueDate: "May 22, 2025",
      daysLeft: 6,
      status: "Pending",
    },
    {
      id: 4,
      title: "Programming Assignment",
      course: "CS101",
      dueDate: "May 19, 2025",
      daysLeft: 3,
      status: "In Progress",
    },
    {
      id: 5,
      title: "History Essay",
      course: "HIST105",
      dueDate: "May 25, 2025",
      daysLeft: 9,
      status: "Not Started",
    },
  ]

  return (
    <div className="grid gap-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>{assignment.course}</CardDescription>
              </div>
              <Badge
                variant={
                  assignment.status === "Pending"
                    ? "default"
                    : assignment.status === "In Progress"
                      ? "secondary"
                      : "outline"
                }
              >
                {assignment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Due: {assignment.dueDate}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {assignment.daysLeft} days left
              </div>
            </div>
            <Button size="sm">View Assignment</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
