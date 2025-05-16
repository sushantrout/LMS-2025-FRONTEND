import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function StudentAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: "Final Exam Schedule Posted",
      course: "All Courses",
      date: "May 15, 2025",
      content:
        "The final examination schedule for the Spring semester has been posted. Please check your student portal for your specific exam times and locations.",
      isNew: true,
    },
    {
      id: 2,
      title: "Library Extended Hours",
      course: "Campus Services",
      date: "May 14, 2025",
      content:
        "The university library will be extending its hours during finals week. The library will be open 24/7 from May 25th to June 5th.",
      isNew: true,
    },
    {
      id: 3,
      title: "Guest Lecture: AI in Modern Society",
      course: "CS101",
      date: "May 10, 2025",
      content:
        "Dr. Emily Chen from Tech University will be giving a guest lecture on 'Artificial Intelligence in Modern Society' on May 22nd at 3:00 PM in Lecture Hall B.",
      isNew: false,
    },
    {
      id: 4,
      title: "Summer Registration Open",
      course: "Registrar",
      date: "May 8, 2025",
      content:
        "Registration for summer courses is now open. Please consult with your academic advisor before registering for summer classes.",
      isNew: false,
    },
  ]

  return (
    <div className="grid gap-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{announcement.title}</CardTitle>
                {announcement.isNew && <Badge variant="secondary">New</Badge>}
              </div>
            </div>
            <CardDescription>
              {announcement.course} • {announcement.date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm">{announcement.content}</p>
            <Button size="sm" variant="outline">
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
