import { httpClient } from "./http-service";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/course-category";

export const courseCategoryService = {
  getCourseCategoryList() {
    return lmsService.get(`${BASE_URL}`);
  }
};