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
import QuizQuestion from "./quiz-question";

// Types
export type QuestionType = "SINGLE_SELECT" | "MULTI_SELECT" | "DESCRIPTIVE";

export interface Option {
  id: string;
  value: string;
  isCorrect: boolean;
  isActive: boolean;
  isDeleted: boolean;
}

export interface Question {
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
    setExpandedIndex(null);
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
    setExpandedIndex(questions.length);
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
    questionService
      .createQuestioner(selectedSession.id, { questions: questions })
      .then((res) => {
        showSuccessToast("Quiz created successfully");
        handleClose();
      })
      .catch((err) => {
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
          onChange={(e) => {
            const mod = modules.find((m) => m.id === e.target.value);
            setSelectedModule(mod || null);
            setSelectedSession(null);
          }}
        >
          <option value="">Select Module</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>

        {/* Session Dropdown */}
        {selectedModule && (
          <select
            className="w-full border px-2 py-1 rounded mb-4"
            value={selectedSession?.id || ""}
            onChange={(e) => {
              const sess = selectedModule.sessions.find(
                (s: any) => s.id === e.target.value
              );
              setSelectedSession(sess || null);
            }}
          >
            <option value="">Select Session</option>
            {selectedModule.sessions.map((sess: any) => (
              <option key={sess.id} value={sess.id}>
                {sess.name}
              </option>
            ))}
          </select>
        )}

        {/* Quiz UI only if session is selected */}
        {selectedSession && (
          <QuizQuestion
            questions={questions}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
            updateQuestion={updateQuestion}
            updateOption={updateOption}
            removeOption={removeOption}
            addOption={addOption}
            addQuestion={addQuestion}
          />
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

