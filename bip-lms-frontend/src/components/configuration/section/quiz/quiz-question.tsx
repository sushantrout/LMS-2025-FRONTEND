"use client"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Question, QuestionType } from "@/types/model/question-model"
import { Option } from "@/types/model/option-model"
import { Textarea } from "@/components/ui/textarea"

export default function QuizQuestion({
  questions,
  expandedIndex,
  setExpandedIndex,
  updateQuestion,
  updateOption,
  removeOption,
  addOption,
  addQuestion,
  disabled = false,
}: {
  questions: Question[]
  expandedIndex: number | null
  setExpandedIndex: (index: number) => void
  updateQuestion: (index: number, updated: Partial<Question>) => void
  updateOption: (qIndex: number, oIndex: number, updated: Partial<Option>) => void
  removeOption: (qIndex: number, oIndex: number) => void
  addOption: (qIndex: number) => void
  addQuestion: () => void
  disabled?: boolean
}) {
  return (
    <div className={`flex flex-col gap-6 ${disabled ? 'blur-sm pointer-events-none select-none' : ''}`}>
      {!questions || questions.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No questions yet. Create your first question to get started.</p>
          <Button onClick={addQuestion} disabled={disabled}>
            <Plus className="mr-2 h-4 w-4" /> Create First Question
          </Button>
        </div>
      ) : (
        questions.map((q, qIndex) => (
          <Card key={q.id} className="shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader
              className={`flex flex-row items-center justify-between p-4 cursor-pointer ${
                expandedIndex === qIndex ? "border-b" : ""
              }`}
              onClick={() => setExpandedIndex(qIndex)}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {qIndex + 1}
                </Badge>
                <CardTitle className="text-base font-medium">
                  {q.question ? q.question : `Question ${qIndex + 1}`}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getQuestionTypeBadgeVariant(q.type)} className="mr-2">
                  {getQuestionTypeLabel(q.type)}
                </Badge>
                {expandedIndex === qIndex ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            {expandedIndex === qIndex && (
              <CardContent className="p-4 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={`question-${q.id}`} className="font-medium">
                    Question Text
                  </Label>
                  <Textarea
                    id={`question-${q.id}`}
                    placeholder="Enter your question"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`type-${q.id}`} className="font-medium">
                    Question Type
                  </Label>
                  <Select
                    value={q.type}
                    onValueChange={(value) =>
                      updateQuestion(qIndex, {
                        type: value as QuestionType,
                        options: q.type !== "DESCRIPTIVE" && value === "DESCRIPTIVE" ? [] : q.options,
                      })
                    }
                  >
                    <SelectTrigger id={`type-${q.id}`}>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE_SELECT">Single Select</SelectItem>
                      <SelectItem value="MULTI_SELECT">Multi Select</SelectItem>
                      <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {q.type !== "DESCRIPTIVE" && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Answer Options</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                              <Plus className="h-4 w-4 mr-1" /> Add Option
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add a new answer option</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {q.options.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md bg-muted/30">
                        <p className="text-sm text-muted-foreground">No options yet. Add your first option.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => (
                          <div
                            key={opt.id}
                            className="flex gap-3 items-center p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
                          >
                            <div className="flex-1">
                              <Input
                                placeholder="Option text"
                                value={opt.value}
                                onChange={(e) => updateOption(qIndex, oIndex, { value: e.target.value })}
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              {q.type === "SINGLE_SELECT" ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2">
                                        <RadioGroup
                                          value={opt.isCorrect ? "correct" : ""}
                                          onValueChange={(value) => {
                                            const updatedOptions = q.options.map((option, idx) => ({
                                              ...option,
                                              isCorrect: idx === oIndex,
                                            }))
                                            updateQuestion(qIndex, { options: updatedOptions })
                                          }}
                                        >
                                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="correct" id={`radio-${q.id}-${opt.id}`} />
                                            <Label htmlFor={`radio-${q.id}-${opt.id}`} className="text-sm font-normal">
                                              Correct
                                            </Label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Mark as correct answer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          id={`checkbox-${q.id}-${opt.id}`}
                                          checked={opt.isCorrect}
                                          onCheckedChange={(checked) =>
                                            updateOption(qIndex, oIndex, { isCorrect: checked as boolean })
                                          }
                                        />
                                        <Label htmlFor={`checkbox-${q.id}-${opt.id}`} className="text-sm font-normal">
                                          Correct
                                        </Label>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Mark as correct answer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeOption(qIndex, oIndex)}
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove this option</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {q.type === "DESCRIPTIVE" && (
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Descriptive questions allow respondents to provide free-form text answers.
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))
      )}

      {questions && questions.length > 0 && (
        <Button onClick={addQuestion} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add New Question
        </Button>
      )}
    </div>
  )
}

// Helper functions
function getQuestionTypeLabel(type: QuestionType): string {
  switch (type) {
    case "SINGLE_SELECT":
      return "Single Choice"
    case "MULTI_SELECT":
      return "Multiple Choice"
    case "DESCRIPTIVE":
      return "Descriptive"
    default:
      return type
  }
}

function getQuestionTypeBadgeVariant(type: QuestionType): "default" | "secondary" | "outline" {
  switch (type) {
    case "SINGLE_SELECT":
      return "default"
    case "MULTI_SELECT":
      return "secondary"
    case "DESCRIPTIVE":
      return "outline"
    default:
      return "default"
  }
}
