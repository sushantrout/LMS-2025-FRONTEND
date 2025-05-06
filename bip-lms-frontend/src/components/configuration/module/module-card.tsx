import { CalendarDays, Clock, Users, BookOpen, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ModuleCard() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge className="mb-2">In Progress</Badge>
            <CardTitle className="text-2xl">Introduction to React</CardTitle>
            <CardDescription className="mt-2">
              Learn the fundamentals of React, including components, props, state, and hooks.
            </CardDescription>
          </div>
          <div className="h-16 w-16 rounded-md overflow-hidden">
            <img src="/placeholder.svg?height=64&width=64" alt="React logo" className="h-full w-full object-cover" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="mr-1 h-4 w-4" />
            <span>5 Sessions</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>8 Hours Total</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>Ends on May 30, 2025</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>24 Enrolled</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">40%</span>
          </div>
          <Progress value={40} className="h-2" />
        </div>

        <div className="pt-4">
          <h3 className="font-medium mb-2">Sessions</h3>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                title: "Getting Started with React",
                duration: "1.5 hours",
                completed: true,
                description: "Introduction to React, setting up your development environment.",
              },
              {
                title: "Components and Props",
                duration: "2 hours",
                completed: true,
                description: "Learn about React components and how to pass data with props.",
              },
              {
                title: "State and Lifecycle",
                duration: "1.5 hours",
                completed: false,
                description: "Understanding state management and component lifecycle.",
              },
              {
                title: "Hooks in React",
                duration: "2 hours",
                completed: false,
                description: "Learn about React Hooks like useState, useEffect, and custom hooks.",
              },
              {
                title: "Building a Complete App",
                duration: "1 hour",
                completed: false,
                description: "Apply everything you've learned to build a complete React application.",
              },
            ].map((session, index) => (
              <AccordionItem key={index} value={`session-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${session.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {session.completed ? "✓" : index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{session.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {session.duration}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-8 pt-2 pb-1">
                    <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Instructor" />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Instructor: Sarah Johnson</span>
                    </div>
                    <Button variant={session.completed ? "outline" : "default"} size="sm" className="w-full sm:w-auto">
                      {session.completed ? "Review Session" : "Start Session"}
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Resources</Button>
        <Button>Continue Learning</Button>
      </CardFooter>
    </Card>
  )
}
