import { Course } from "./course-model";
import { Event } from "./session-model";
export type Module = {
    id: string;
    name: string;
    description: string;
    trainerId: string;
    sortOrder: number;
    noOfSessions: number;
    sessions: Event[];
    course:Course;
  };
  