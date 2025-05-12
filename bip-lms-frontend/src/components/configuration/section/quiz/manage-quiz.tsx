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
import { questionService } from "@/http/question-service";
import { showErrorToast, showSuccessToast } from "@/util/helpers/toast-helper";
import QuizQuestion from "./quiz-question";
import { Question } from "@/types/model/question-model";
import { Option } from "@/types/model/option-model";
import QuizModuleDropdown from "./quiz-module";
import QuizSessionDropdown from "./quiz-session";

interface ManageQuizModalProps {
  isQuizModalOpen: boolean;
  setIsQuizModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modules : Module[];
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export default function ManageQuizModal({
  isQuizModalOpen,
  setIsQuizModalOpen,
  modules,
}: ManageQuizModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modulesArr, setModulesArr] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    debugger;
    if (isQuizModalOpen) {
        setModulesArr(modules || []);
    }
  }, [isQuizModalOpen]);
  

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
        <QuizModuleDropdown
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          modules={modulesArr}
          setSelectedSession={setSelectedSession}
        />

        {/* Session Dropdown */}
        {selectedModule && (
          <QuizSessionDropdown
            selectedSession={selectedSession}
            selectedModule={selectedModule}
            setSelectedSession={setSelectedSession}
          />
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
