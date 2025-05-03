import { ArrowLeft, Clock, Star, Users, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

interface CourseParams {
  params: {
    id: string
  }
}

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  console.log(id);
  const course = courses.find((c) => c?.id === id) || courses?.[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        <img 
          src={course.image || "/placeholder.svg?height=400&width=1200"} 
          alt={course.title} 
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
        <div className="container relative z-20 px-4 -mt-[200px] md:-mt-[250px]">
          <Link href="/courses" className="inline-flex items-center gap-2 text-white mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
          <Badge className={`mb-4 ${
            course.category === "Leadership"
              ? ""
              : course.category === "Technical Skills"
                ? ""
                : ""
          }`}>
            {course.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{course.rating}</span>
              <span className="text-white/70">({course.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5" />
              <span>{course.students} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              </svg>
              <span>{course.lessons} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container px-4 py-8">
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
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About This Course</h2>
                  <p className="text-muted-foreground">{course.description}</p>
                  <p className="text-muted-foreground mt-4">
                    This comprehensive course is designed for professionals looking to enhance their skills in {course.category.toLowerCase()}. 
                    Whether you're a beginner or looking to refine your existing knowledge, this course provides practical insights and 
                    hands-on experience to help you excel in your career.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum">
                <h2 className="text-2xl font-semibold mb-4">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4">
                        <h3 className="font-medium">{section.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {section.lessons.length} lessons • {section.duration}
                        </div>
                      </div>
                      <div className="divide-y">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="p-4 flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                {lessonIndex + 1}
                              </div>
                              <div>
                                <div className="font-medium">{lesson.title}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </div>
                              </div>
                            </div>
                            {lesson.preview && (
                              <Button variant="ghost" size="sm">Preview</Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="instructor">
                <h2 className="text-2xl font-semibold mb-4">Meet Your Instructor</h2>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{course.instructor.name}</h3>
                    <p className="text-muted-foreground">{course.instructor.title}</p>
                    <div className="flex items-center gap-4 my-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{course.instructor.rating} Instructor Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.instructor.students} Students</span>
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
                          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        </svg>
                        <span>{course.instructor.courses} Courses</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-5xl font-bold mb-2">{course.rating}</div>
                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= Math.floor(course.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} 
                          />
                        ))}
                      </div>
                      <div className="text-muted-foreground">Course Rating</div>
                      <div className="mt-1 font-medium">{course.reviews} Reviews</div>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1;
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                              <span>{rating}</span>
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </div>
                            <Progress value={percentage} className="h-2 flex-1" />
                            <div className="w-12 text-right text-muted-foreground">{percentage}%</div>
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
                          comment: "This course exceeded my expectations. The instructor explains complex concepts in a way that's easy to understand. Highly recommended!"
                        },
                        {
                          name: "Sarah Miller",
                          date: "1 month ago",
                          rating: 4,
                          comment: "Great content and well-structured lessons. I would have liked more practical exercises, but overall it's a solid course."
                        },
                        {
                          name: "David Chen",
                          date: "2 months ago",
                          rating: 5,
                          comment: "The best course I've taken on this subject. The instructor is knowledgeable and engaging. I've already applied what I learned to my work."
                        }
                      ].map((review, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.name}</div>
                                <div className="text-xs text-muted-foreground">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
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
                <div className="text-3xl font-bold mb-4">${course.price}</div>
                <Button className="w-full mb-3 ">Enroll Now</Button>
                <Button variant="outline" className="w-full mb-6">Add to Wishlist</Button>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{course.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
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
                      { icon: "smartphone", text: "Mobile access" }
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
                          {item.icon === "video" && <path d="M22 8.5a2.5 2.5 0 0 0-3.5-2.3L18 6.5l-6 4V6.5l-1-.3a2.5 2.5 0 0 0-3.5 2.3v7a2.5 2.5 0 0 0 3.5 2.3l1-.3v-3.5l6 4 .5.3a2.5 2.5 0 0 0 3.5-2.3z" />}
                          {item.icon === "download" && <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />}
                          {item.icon === "message-circle" && <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />}
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
  )
}

// Mock data for the course
const courses = [
  {
    id: "1",
    title: "Effective Leadership Skills",
    description:
      "Learn key leadership skills to inspire and motivate your team for success. This course covers essential leadership principles, communication strategies, team building techniques, and conflict resolution methods that will help you become a more effective leader in any organization.",
    category: "Leadership",
    duration: "3h 45m",
    lessons: 12,
    rating: 4.8,
    reviews: 245,
    students: 1842,
    price: 89.99,
    level: "Intermediate",
    image: "/placeholder.svg?height=400&width=1200",
    learningOutcomes: [
      "Develop effective leadership communication skills",
      "Learn how to motivate and inspire team members",
      "Master conflict resolution techniques",
      "Build high-performing teams through effective delegation",
      "Create a positive work environment that fosters growth",
      "Implement strategic decision-making processes",
      "Develop emotional intelligence as a leader",
      "Learn how to lead through organizational change",
    ],
    requirements: [
      "No prior leadership experience required",
      "Basic understanding of workplace dynamics",
      "Willingness to practice and apply concepts",
      "Access to a team or group for practical exercises (recommended but not required)",
    ],
    curriculum: [
      {
        title: "Introduction to Leadership",
        duration: "45 minutes",
        lessons: [
          { title: "What Makes an Effective Leader", duration: "15 min", preview: true },
          { title: "Leadership Styles and Approaches", duration: "20 min", preview: false },
          { title: "Your Leadership Journey", duration: "10 min", preview: false },
        ],
      },
      {
        title: "Communication Skills for Leaders",
        duration: "1 hour",
        lessons: [
          { title: "Active Listening Techniques", duration: "15 min", preview: true },
          { title: "Giving Effective Feedback", duration: "20 min", preview: false },
          { title: "Communicating Vision and Goals", duration: "25 min", preview: false },
        ],
      },
      {
        title: "Building and Leading Teams",
        duration: "1 hour",
        lessons: [
          { title: "Team Formation and Development", duration: "20 min", preview: false },
          { title: "Delegation and Empowerment", duration: "20 min", preview: false },
          { title: "Managing Team Dynamics", duration: "20 min", preview: false },
        ],
      },
      {
        title: "Conflict Resolution and Problem Solving",
        duration: "1 hour",
        lessons: [
          { title: "Identifying Sources of Conflict", duration: "15 min", preview: false },
          { title: "Mediation Techniques", duration: "25 min", preview: false },
          { title: "Problem-Solving Frameworks", duration: "20 min", preview: false },
        ],
      },
    ],
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "Leadership Development Expert",
      bio: "Dr. Sarah Johnson has over 15 years of experience in leadership development and organizational psychology. She has worked with Fortune 500 companies to develop leadership programs and has authored three books on effective leadership strategies.",
      rating: 4.9,
      students: 12500,
      courses: 8,
    },
  },
  {
    id: "2",
    title: "Advanced Excel for Professionals",
    description: "Master advanced Excel features to analyze data and create powerful reports.",
    category: "Technical Skills",
    duration: "5h 20m",
    lessons: 18,
    rating: 4.5,
    reviews: 189,
    students: 2156,
    price: 79.99,
    level: "Advanced",
    image: "/placeholder.svg?height=400&width=1200",
    learningOutcomes: [
      "Master advanced Excel formulas and functions",
      "Create dynamic dashboards and reports",
      "Perform complex data analysis with pivot tables",
      "Automate tasks with macros and VBA",
      "Implement data validation and protection",
      "Use advanced charting techniques",
      "Master lookup and reference functions",
      "Perform what-if analysis and forecasting",
    ],
    requirements: [
      "Intermediate Excel skills required",
      "Excel 2016 or later installed on your computer",
      "Basic understanding of formulas and functions",
      "Familiarity with Excel interface and navigation",
    ],
    curriculum: [
      {
        title: "Advanced Formulas and Functions",
        duration: "1 hour 15 minutes",
        lessons: [
          { title: "Nested Functions and Formula Logic", duration: "25 min", preview: true },
          { title: "Advanced Lookup Functions", duration: "25 min", preview: false },
          { title: "Array Formulas and Dynamic Arrays", duration: "25 min", preview: false },
        ],
      },
      {
        title: "Data Analysis and Visualization",
        duration: "1 hour 30 minutes",
        lessons: [
          { title: "Advanced Pivot Tables", duration: "30 min", preview: true },
          { title: "Power Query Fundamentals", duration: "30 min", preview: false },
          { title: "Creating Interactive Dashboards", duration: "30 min", preview: false },
        ],
      },
      {
        title: "Automation with Macros and VBA",
        duration: "1 hour 45 minutes",
        lessons: [
          { title: "Recording and Editing Macros", duration: "25 min", preview: false },
          { title: "VBA Fundamentals", duration: "40 min", preview: false },
          { title: "Creating Custom Functions", duration: "40 min", preview: false },
        ],
      },
      {
        title: "Advanced Excel Applications",
        duration: "50 minutes",
        lessons: [
          { title: "Financial Modeling Techniques", duration: "25 min", preview: false },
          { title: "Data Forecasting and What-If Analysis", duration: "25 min", preview: false },
        ],
      },
    ],
    instructor: {
      name: "Michael Chen",
      title: "Excel Expert & Data Analyst",
      bio: "Michael Chen is a certified Microsoft Excel Expert with over 10 years of experience in data analysis and financial modeling. He has trained professionals at major financial institutions and consulting firms.",
      rating: 4.7,
      students: 18750,
      courses: 5,
    },
  },
  {
    id: "3",
    title: "Communication Mastery",
    description: "Enhance your communication skills for better workplace relationships.",
    category: "Soft Skills",
    duration: "2h 55m",
    lessons: 9,
    rating: 4.7,
    reviews: 156,
    students: 1245,
    price: 69.99,
    level: "All Levels",
    image: "/placeholder.svg?height=400&width=1200",
    learningOutcomes: [
      "Develop effective verbal and non-verbal communication",
      "Master active listening techniques",
      "Improve presentation and public speaking skills",
      "Communicate confidently in difficult conversations",
      "Adapt communication style to different audiences",
      "Write clear and impactful business communications",
      "Build rapport and strengthen professional relationships",
      "Use storytelling to enhance your message",
    ],
    requirements: [
      "No prior experience required",
      "Willingness to practice communication exercises",
      "Open mind to receive feedback",
      "Basic English language proficiency",
    ],
    curriculum: [
      {
        title: "Foundations of Effective Communication",
        duration: "45 minutes",
        lessons: [
          { title: "Communication Models and Barriers", duration: "15 min", preview: true },
          { title: "Verbal and Non-verbal Communication", duration: "15 min", preview: false },
          { title: "Active Listening Skills", duration: "15 min", preview: false },
        ],
      },
      {
        title: "Professional Communication Skills",
        duration: "1 hour",
        lessons: [
          { title: "Email and Written Communication", duration: "20 min", preview: true },
          { title: "Meeting Facilitation", duration: "20 min", preview: false },
          { title: "Giving and Receiving Feedback", duration: "20 min", preview: false },
        ],
      },
      {
        title: "Presentation and Public Speaking",
        duration: "1 hour 10 minutes",
        lessons: [
          { title: "Structuring Compelling Presentations", duration: "25 min", preview: false },
          { title: "Delivery Techniques and Body Language", duration: "25 min", preview: false },
          { title: "Handling Q&A and Difficult Audiences", duration: "20 min", preview: false },
        ],
      },
    ],
    instructor: {
      name: "Emma Rodriguez",
      title: "Communication Coach & Trainer",
      bio: "Emma Rodriguez is a communication specialist with a background in corporate training and coaching. She has helped thousands of professionals improve their communication skills through workshops and one-on-one coaching.",
      rating: 4.8,
      students: 9850,
      courses: 4,
    },
  },
  {
    id: "4",
    title: "Cybersecurity Essentials",
    description: "Learn essential cybersecurity practices to protect company data.",
    category: "Technical Skills",
    duration: "4h 10m",
    lessons: 14,
    rating: 4.6,
    reviews: 178,
    students: 1567,
    price: 99.99,
    level: "Beginner to Intermediate",
    image: "/placeholder.svg?height=400&width=1200",
    learningOutcomes: [
      "Understand fundamental cybersecurity concepts",
      "Identify common security threats and vulnerabilities",
      "Implement basic security measures for data protection",
      "Recognize social engineering attacks",
      "Create strong password policies",
      "Understand encryption basics",
      "Implement secure network practices",
      "Develop an incident response plan",
    ],
    requirements: [
      "Basic computer knowledge",
      "No prior cybersecurity experience required",
      "Interest in IT security concepts",
      "Computer with internet access",
    ],
    curriculum: [
      {
        title: "Introduction to Cybersecurity",
        duration: "1 hour",
        lessons: [
          { title: "The Cybersecurity Landscape", duration: "20 min", preview: true },
          { title: "Common Threats and Attack Vectors", duration: "20 min", preview: false },
          { title: "Security Principles and Frameworks", duration: "20 min", preview: false },
        ],
      },
      {
        title: "Securing Systems and Data",
        duration: "1 hour 30 minutes",
        lessons: [
          { title: "Password Security and Authentication", duration: "30 min", preview: true },
          { title: "Encryption Fundamentals", duration: "30 min", preview: false },
          { title: "Secure Data Storage and Transmission", duration: "30 min", preview: false },
        ],
      },
      {
        title: "Network Security",
        duration: "1 hour",
        lessons: [
          { title: "Firewalls and Network Protection", duration: "20 min", preview: false },
          { title: "Secure Remote Access", duration: "20 min", preview: false },
          { title: "Wireless Network Security", duration: "20 min", preview: false },
        ],
      },
      {
        title: "Security Awareness and Response",
        duration: "40 minutes",
        lessons: [
          { title: "Social Engineering Awareness", duration: "20 min", preview: false },
          { title: "Incident Response Basics", duration: "20 min", preview: false },
        ],
      },
    ],
    instructor: {
      name: "Robert Williams",
      title: "Cybersecurity Specialist",
      bio: "Robert Williams is a certified cybersecurity professional with over 12 years of experience in the field. He has worked as a security consultant for various organizations and specializes in security awareness training and vulnerability assessment.",
      rating: 4.8,
      students: 7650,
      courses: 6,
    },
  },
]
