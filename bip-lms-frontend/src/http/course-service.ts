import { httpClient } from "./http-service";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/course";

export const courseService = {
  getCourseList() {
    return lmsService.get(`${BASE_URL}`);
  },
  getCourseDetail(id: string) {
    return lmsService.get(`${BASE_URL}/detail/${id}`);
  },
  createCourse(data: any) {
    return lmsService.post(`${BASE_URL}/create`, data);
  },
  updateCourse(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/update/${id}`, data);
  },
  deleteCourse(id: string) {
    return lmsService.delete(`${BASE_URL}/delete/${id}`);
  },
};