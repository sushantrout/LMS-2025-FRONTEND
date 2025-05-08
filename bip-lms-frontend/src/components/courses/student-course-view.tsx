"use client"
import { useEffect, useState } from "react"
import { X, ChevronDown, ChevronUp, Clock, CheckCircle, Circle, Play } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { courseService } from "@/http/course-service"
import type { CourseOverView } from "@/types/model/course-overview-model"
import type { SessionOverview } from "@/types/model/session-overview-model"
import { questionService } from "@/http/question-service"
import type { Question } from "../configuration/section/quiz/manage-quiz"
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function StudentCourseView({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<CourseOverView | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionOverview | null>(null)
  const [progress, setProgress] = useState(42) // Example progress percentage

  useEffect(() => {
    const fetchData = async () => {
      const fetchData = async () => {
        try {
          const response = await courseService.getCourseOverView(courseId)
          setCourse(response.data?.data || null)
        } catch (error) {
          console.error("Failed to fetch course:", error)
        }
      }

      fetchData()
    }

    fetchData()
  }, [courseId])

  const getQuestionDetail = () =>
    questionService.getQuestioner(selectedSession.sessionId).then((quiestionDetail) => {
      console.log(quiestionDetail.data.data)
      setQuestions(quiestionDetail?.data?.data)
    })

  useEffect(() => {
    if (selectedSession) {
      getQuestionDetail()
    }
  }, [selectedSession])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full bg-gray-900 h-[40vh] md:h-[50vh] flex items-center justify-center relative group overflow-hidden">
          {selectedSession?.link ? (
            <video
              className="w-full h-full object-cover"
              poster="/modern-classroom-thumbnail.png"
              controls
            >
              <source src={selectedSession.link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors cursor-pointer">
                <Play className="w-10 h-10 fill-white text-white ml-1" />
              </div>
              <p className="text-lg font-medium">
                {selectedSession?.sessionName ||
                  "Select a lesson to start learning"}
              </p>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <p className="text-sm text-gray-300">
                  {selectedSession?.duration}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <span>1x</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  HD
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-white flex-grow overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 bg-white z-10 border-b">
              <TabsList className="h-auto bg-transparent flex w-full justify-start overflow-x-auto px-4">
                {["Overview", "Q&A", "Comments"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 text-gray-600 text-sm font-medium"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="Overview" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedSession?.sessionName || "Course Overview"}
                  </h2>

                  {selectedSession && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedSession.sessionDescription ||
                          "<p>No description available for this lesson. Select another lesson to view its content.</p>",
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Q&A" className="p-6 m-0">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  {questions && questions.length > 0 ? (
                    <AssessmentContent questions={questions} />
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">
                          {selectedSession
                            ? "No questions available for this lesson."
                            : "Select a lesson to view its questions."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-800">Course content</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {progress}% complete
            </Badge>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {course.modules.map((module, moduleIndex) => (
            <div key={module.moduleId} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(module.moduleId)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
              >
                <div className="flex-1 pr-2">
                  <h3 className="text-sm font-medium text-gray-800">
                    <span className="text-indigo-600 mr-2">Module {moduleIndex + 1}:</span> {module.moduleName}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{module.noOfSessions} lessons</span>
                    <span className="mx-1">•</span>
                    <span>{module.moduleName}</span>
                  </div>
                </div>
                {expandedSections.includes(module.moduleId) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {expandedSections.includes(module.moduleId) && (
                <div className="bg-gray-50">
                  {module.sessions.map((session, sessionIndex) => {
                    const isSelected = selectedSession?.sessionId === session.sessionId
                    const isCompleted = sessionIndex < 3 // Example logic for completed sessions

                    return (
                      <div
                        key={session.sessionId}
                        className={`flex gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer ${
                          isSelected ? "bg-indigo-50 hover:bg-indigo-50" : ""
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <p
                            className={`text-sm font-medium leading-tight ${
                              isSelected ? "text-indigo-700" : "text-gray-800"
                            }`}
                          >
                            {session.sessionName}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.duration}</span>
                            </div>
                            {/* {session.hasResources && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Resources</span>
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next lesson button */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <Button className="w-full" size="lg">
            Continue to Next Lesson
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AssessmentContent({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const progress = (Object.keys(answers).length / totalQuestions) * 100

  const handleSingleSelectChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleDescriptiveChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    let calculatedScore = 0

    // Calculate score for single select questions
    questions.forEach((question) => {
      if (question.type === "SINGLE_SELECT") {
        const selectedOptionId = answers[question.id]
        const selectedOption = question.options.find((option) => option.id === selectedOptionId)
        if (selectedOption?.isCorrect) {
          calculatedScore += 1
        }
      }
    })

    setScore(calculatedScore)
    setSubmitted(true)
    setShowResults(true)
  }

  const isOptionCorrect = (questionId: string, optionId: string) => {
    if (!submitted) return null

    const question = questions.find((q) => q.id === questionId)
    if (!question || question.type !== "SINGLE_SELECT") return null

    const option = question.options.find((opt) => opt.id === optionId)
    return option?.isCorrect
  }

  const isAnswerSelected = (questionId: string, optionId: string) => {
    return answers[questionId] === optionId
  }

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const resetAssessment = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setSubmitted(false)
    setScore(0)
    setShowResults(false)
  }

  const renderQuestionIndicators = () => {
    return (
      <div className="flex justify-center gap-2 mb-6">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToQuestion(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors
              ${
                index === currentQuestionIndex
                  ? "bg-indigo-600 text-white"
                  : answers[questions[index].id]
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    )
  }

  const renderResults = () => {
    const singleSelectQuestions = questions.filter((q) => q.type === "SINGLE_SELECT")
    const percentageScore = singleSelectQuestions.length > 0 ? (score / singleSelectQuestions.length) * 100 : 0

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Assessment Complete</h2>
          <div className="inline-block rounded-lg bg-gray-100 px-4 py-2 mb-4">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-gray-500">/{singleSelectQuestions.length}</span>
            <p className="text-sm text-gray-600 mt-1">{Math.round(percentageScore)}% Score</p>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gray-50 p-4 pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="mb-2">
                      Question {index + 1}
                    </Badge>
                    {question.type === "SINGLE_SELECT" && (
                      <Badge
                        variant={isOptionCorrect(question.id, answers[question.id] || "") ? "outline" : "outline"}
                        className={
                          isOptionCorrect(question.id, answers[question.id] || "")
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                        }
                      >
                        {isOptionCorrect(question.id, answers[question.id] || "") ? "Correct" : "Incorrect"}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{question.question}</h3>
                </div>
                <div className="p-4">
                  {question.type === "SINGLE_SELECT" ? (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isCorrect = option.isCorrect
                        const isSelected = isAnswerSelected(question.id, option.id)

                        return (
                          <div
                            key={option.id}
                            className={`flex items-center space-x-2 rounded-md border p-3 ${
                              isCorrect
                                ? "border-green-500 bg-green-50"
                                : isSelected && !isCorrect
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200"
                            }`}
                          >
                            <div className="flex-grow">{option.value}</div>
                            {isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {isSelected && !isCorrect && <AlertCircle className="h-5 w-5 text-red-500" />}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-2">Your Answer:</p>
                      <div className="border rounded-md p-3 bg-gray-50">
                        {answers[question.id] || "No answer provided"}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={resetAssessment} className="bg-indigo-600 hover:bg-indigo-700">
            Retake Assessment
          </Button>
        </div>
      </div>
    )
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    return (
      <div className="space-y-6">
        {renderQuestionIndicators()}

        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
          <Badge
            variant="outline"
            className={
              currentQuestion.type === "SINGLE_SELECT"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-purple-50 text-purple-700 border-purple-200"
            }
          >
            {currentQuestion.type === "SINGLE_SELECT" ? "Multiple Choice" : "Free Response"}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

        {currentQuestion.type === "SINGLE_SELECT" ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSingleSelectChange(currentQuestion.id, option.id)}
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-all hover:border-gray-300 hover:bg-gray-50 cursor-pointer ${
                  isAnswerSelected(currentQuestion.id, option.id) ? "border-indigo-400 bg-indigo-50" : "border-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isAnswerSelected(currentQuestion.id, option.id) ? "border-indigo-600" : "border-gray-300"
                  }`}
                >
                  {isAnswerSelected(currentQuestion.id, option.id) && (
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  )}
                </div>
                <div className="flex-grow font-medium">{option.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor={`textarea-${currentQuestion.id}`} className="text-sm text-gray-500">
              Enter your answer below
            </label>
            <Textarea
              id={`textarea-${currentQuestion.id}`}
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleDescriptiveChange(currentQuestion.id, e.target.value)}
              rows={6}
              className="w-full resize-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < totalQuestions}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Add imports at the top of the file
  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No questions available for this lesson.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6">
        {!showResults && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                {Object.keys(answers).length} of {totalQuestions} questions answered
              </p>
              <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {showResults ? renderResults() : renderQuestion()}

        {!showResults && (
          <div className="flex flex-col border-t mt-6 pt-4">
            <p className="text-xs text-gray-500 text-center">
              Answer all questions to submit your assessment. Your progress is saved automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
