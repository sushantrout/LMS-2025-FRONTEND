import { User } from "./user-model";

export type CourseReview = MasterData & {
  feedback: string;
  rating: number;
  user: User;
};
