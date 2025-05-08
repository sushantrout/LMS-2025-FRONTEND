"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Module } from "@/types/model/module-model";
import { moduleService } from "@/http/module-service";
import { questionService } from "@/http/question-service";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";

// Types
type QuestionType = "SINGLE_SELECT" | "MULTI_SELECT" | "DESCRIPTIVE";

interface Option {
  id: string;
  value: string;
  isCorrect: boolean;
  isActive: boolean;
  isDeleted: boolean;
}

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  isActive: boolean;
  isDeleted: boolean;
  options: Option[];
}

interface ManageQuizModalProps {
  isQuizModalOpen: boolean;
  setIsQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: string;
  getModulesByCourseId: () => Promise<void>;
  selectedSession: Module | null;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export default function ManageQuizModal({
  courseId,
  isQuizModalOpen,
  setIsQuizModalOpen,
  getModulesByCourseId,
}: ManageQuizModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await moduleService.getModuleByCourseId(courseId);
      setModules(res?.data?.data || []);
    })();
  }, [getModulesByCourseId]);

  const handleClose = () => {
    setIsQuizModalOpen(false);
    setSelectedModule(null);
    setSelectedSession(null);
    setQuestions([]);
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: generateId(),
        question: "",
        type: "SINGLE_SELECT",
        isActive: true,
        isDeleted: false,
        options: [],
      },
    ]);
  };

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updated };
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push({
      id: generateId(),
      value: "",
      isCorrect: false,
      isActive: true,
      isDeleted: false,
    });
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    qIndex: number,
    oIndex: number,
    updated: Partial<Option>
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = {
      ...updatedQuestions[qIndex].options[oIndex],
      ...updated,
    };
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    questionService.createQuestioner(selectedSession.id, { questions: questions }).then((res) => {
        showSuccessToast("Quiz created successfully");
        handleClose();
    }).catch((err) => {
        showErrorToast(err?.response?.data?.message || "Error creating quiz");
    });
  };

  return (
    <Dialog open={isQuizModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quiz / Questionnaire</DialogTitle>
        </DialogHeader>

        {/* Module Dropdown */}
        <select
          className="w-full border px-2 py-1 rounded mb-4"
          value={selectedModule?.id || ""}
          onChange={e => {
            const mod = modules.find(m => m.id === e.target.value);
            setSelectedModule(mod || null);
            setSelectedSession(null);
          }}
        >
          <option value="">Select Module</option>
          {modules.map(mod => (
            <option key={mod.id} value={mod.id}>{mod.name}</option>
          ))}
        </select>

        {/* Session Dropdown */}
        {selectedModule && (
          <select
            className="w-full border px-2 py-1 rounded mb-4"
            value={selectedSession?.id || ""}
            onChange={e => {
              const sess = selectedModule.sessions.find((s: any) => s.id === e.target.value);
              setSelectedSession(sess || null);
            }}
          >
            <option value="">Select Session</option>
            {selectedModule.sessions.map((sess: any) => (
              <option key={sess.id} value={sess.id}>{sess.name}</option>
            ))}
          </select>
        )}

        {/* Quiz UI only if session is selected */}
        {selectedSession && (
          <div className="flex flex-col gap-6">
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-4 border border-gray-300 rounded space-y-3"
              >
                <label className="font-medium">Question</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="text"
                  placeholder="Enter your question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, { question: e.target.value })
                  }
                />

                <label className="font-medium">Type</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(qIndex, {
                      type: e.target.value as QuestionType,
                      options: [],
                    })
                  }
                >
                  <option value="SINGLE_SELECT">Single Select</option>
                  <option value="MULTI_SELECT">Multi Select</option>
                  <option value="DESCRIPTIVE">Description</option>
                </select>

                {q.type !== "DESCRIPTIVE" && (
                  <div className="space-y-2">
                    {/* <label className="font-medium">Options</label> */}
                    {q.options.map((opt, oIndex) => (
                      <div key={opt.id} className="flex gap-2 items-center">
                        <input
                          className="flex-1 border px-2 py-1 rounded"
                          type="text"
                          placeholder="Option value"
                          value={opt.value}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, {
                              value: e.target.value,
                            })
                          }
                        />
                        {q.type === "SINGLE_SELECT" ? (
                          <input
                            type="radio"
                            name={`single-select-${q.id}`}
                            checked={opt.isCorrect}
                            onChange={() => {
                              // Set only this option as correct
                              const updatedOptions = q.options.map((option, idx) => ({
                                ...option,
                                isCorrect: idx === oIndex,
                              }));
                              updateQuestion(qIndex, { options: updatedOptions });
                            }}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={opt.isCorrect}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, {
                                isCorrect: e.target.checked,
                              })
                            }
                          />
                        )}
                        <span>Correct</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="mt-2"
                    >
                      + Add Option
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* <div>
              <label className="font-semibold block mb-2">JSON Preview:</label>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify({ questions }, null, 2)}
              </pre>
            </div> */}
            <Button onClick={addQuestion}>+ Add Question</Button>
          </div>
        )}

        <DialogFooter>
          {selectedSession && (
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
