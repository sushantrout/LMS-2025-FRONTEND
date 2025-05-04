import { Course } from "./course-model";
import { Session } from "./session-model";
export type Module = MasterData & {
    description?: string;
    trainerId?: string;
    sortOrder?: number;
    noOfSessions?: number;
    sessions: Session[];
    course:Course;
  };
  
export const initialModule: Module = {
    id: "",
    name: "",
    description: "",
    trainerId: "",
    sortOrder: 0,
    noOfSessions: 0,
    sessions: [],
    course:null
  }