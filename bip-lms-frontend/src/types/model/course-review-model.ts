import { User } from "./user-model";

export type CourseReview = MasterData & {
  feedback: string;
  rating: number;
  user: User;
};
export type CourseReviewStats = {
  totalReviews: number;
  averageRating: number;
  fiveStarReviews: number;
  fourStarReviews: number;
  threeStarReviews: number;
  twoStarReviews: number;
  oneStarReviews: number;
}

export type CourseReviewResponse = {
  courseReviews: CourseReview[];
};




