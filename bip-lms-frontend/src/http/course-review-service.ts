import { lmsService } from "./lms-service";

const BASE_URL = "v1/course-review";

export const courseReviewService = {
    getCourseReviews(coureseId: string) {
    return lmsService.get(`${BASE_URL}/get-course-review/${coureseId}`);
  },
};