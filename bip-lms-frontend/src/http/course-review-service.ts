import { CourseReview } from "@/types/model/course-review-model";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/course-review";

export const courseReviewService = {

  saveCourseReview(courseReview: CourseReview) {
    return lmsService.post(`${BASE_URL}`, courseReview);
  },

    getCourseReviews(coureseId: string) {
    return lmsService.get(`${BASE_URL}/get-course-review/${coureseId}`);
  },

  getTotalRatingStatistics(coureseId: string) {
    return lmsService.get(`${BASE_URL}/get-total-rating-statistics/${coureseId}`);
  }
};