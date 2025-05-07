import { Course } from "./course-model";
import { Session } from "./session-model";
import { User } from "./user-model";
export type Module = MasterData & {
    description?: string;
    trainer?: User;
    sortOrder?: number;
    noOfSessions?: number;
    sessions?: Session[];
    course?:Course;
    status?: string;
    expanded?: boolean; // For UI state management
  };
  
export const initialModule: Module = {
    id: "",
    name: "",
    description: "",
    trainer: null,
    sortOrder: 0,
    noOfSessions: 0,
    sessions: [],
    course:null,
    status:''
  }