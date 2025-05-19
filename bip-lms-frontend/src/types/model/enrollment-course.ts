import { User } from "./user-model";

export type EnrollmentCourse = {
    courseId: string;
    traineeId?: User;
    traineeIds: User[];
  }