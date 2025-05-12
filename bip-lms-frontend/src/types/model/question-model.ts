import { Option } from "./option-model";

export type Question = {
    id: string;
    question: string;
    type: QuestionType;
    isActive: boolean;
    isDeleted: boolean;
    options: Option[];
  }

  // Types
export type QuestionType = "SINGLE_SELECT" | "MULTI_SELECT" | "DESCRIPTIVE";