"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Bell, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Link from "next/link"

interface Course {
    id: string
    title: string
    description: string
    category: string
    duration: string
    lessons: number
    rating: number
    image: string
}

const initialCourses: Course[] = [
    {
        id: "1",
        title: "Effective Leadership Skills",
        description: "Learn key leadership skills to inspire and motivate your team for success.",
        category: "Leadership",
        duration: "3h 45m",
        lessons: 12,
        rating: 4.8,
        image: "/images/course/course-cover.avif",
    },
    {
        id: "2",
        title: "Advanced Excel for Professionals",
        description: "Master advanced Excel features to analyze data and create powerful reports.",
        category: "Technical Skills",
        duration: "5h 20m",
        lessons: 18,
        rating: 4.5,
        image: "/images/course/course-cover.avif",
    },
    {
        id: "3",
        title: "Communication Mastery",
        description: "Enhance your communication skills for better workplace relationships.",
        category: "Soft Skills",
        duration: "2h 55m",
        lessons: 9,
        rating: 4.7,
        image: "/images/course/course-cover.avif",
    },
    {
        id: "4",
        title: "Cybersecurity Essentials",
        description: "Learn essential cybersecurity practices to protect company data.",
        category: "Technical Skills",
        duration: "4h 10m",
        lessons: 14,
        rating: 4.6,
        image: "/images/course/course-cover.avif",
    },
]

export default function CourseCatalog() {
    const [courses, setCourses] = useState<Course[]>(initialCourses)
    const [formVisible, setFormVisible] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        duration: "",
        lessons: "",
        rating: "",
        image: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newCourse: Course = {
            id: Date.now().toString(),
            ...formData,
            lessons: Number(formData.lessons),
            rating: Number(formData.rating),
        }
        setCourses((prev) => [newCourse, ...prev])
        setFormVisible(false)
        setFormData({ title: "", description: "", category: "", duration: "", lessons: "", rating: "", image: "" })
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container px-4 py-4 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Course Catalog</h1>
                        <p className="text-muted-foreground">Discover and enroll in training courses to develop your skills</p>
                    </div>
                    <Button onClick={() => setFormVisible((prev) => !prev)}>
                        {formVisible ? "Cancel" : "Create Course"}
                    </Button>
                </div>

                {formVisible && (
                    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-6 bg-card shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Create a New Course</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lessons">Lessons</Label>
                                <Input id="lessons" name="lessons" type="number" value={formData.lessons} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input id="rating" name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={handleCategoryChange} defaultValue={formData.category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                        <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                                        <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" name="image" value={formData.image} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                        </div>

                        <Button type="submit" className="w-full">Create Course</Button>
                    </form>
                )}

                {/* Search and Filter */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search for courses..." className="w-full pl-9" />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All Courses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <CourseGrid courses={courses} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

function CourseGrid({ courses }: { courses: Course[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}

function CourseCard({ course }: { course: Course }) {
    return (
      <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
        <div className="relative">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="aspect-video w-full object-cover"
          />
          <Badge className="absolute left-3 top-3">{course.category}</Badge>
        </div>
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-xl font-semibold">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        </div>
        <div className="mt-auto p-4 pt-0">
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div>{course.lessons} lessons</div>
            <div className="text-yellow-500 font-medium">{course.rating}</div>
          </div>
          <div className="flex gap-2">
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button variant="secondary" className="w-full">View</Button>
            </Link>
            <Link href={`/configuration/manage-course/${course.id}`} className="flex-1">
              <Button className="w-full">Manage</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
