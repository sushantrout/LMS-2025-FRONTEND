import { lmsService } from "./lms-service";

const BASE_URL = "v1/course-category";

export const courseCategoryService = {
  getCourseCategoryList() {
    return lmsService.get(`${BASE_URL}`);
  },
  getCourseCategoryDetail(id: string) {
    return lmsService.get(`${BASE_URL}/detail/${id}`);
  },
  createCourseCategory(data: any) {
    return lmsService.post(`${BASE_URL}/create`, data);
  },
  updateCourseCategory(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/update/${id}`, data);
  },
  deleteCourseCategory(id: string) {
    return lmsService.delete(`${BASE_URL}/delete/${id}`);
  },
};