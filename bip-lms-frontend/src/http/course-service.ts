import { lmsService } from "./lms-service";

const BASE_URL = "v1/course";
const ENROLL_BASE_URL = 'v1/enrollment-course';

export const courseService = {
  getCourseList() {
    return lmsService.get(`${BASE_URL}`);
  },
  getCourseDetail(id: string) {
    return lmsService.get(`${BASE_URL}/${id}`);
  },
  createCourse(data: any) {
    return lmsService.post(`${BASE_URL}/save-with-attachment`, data);
  },
  updateCourse(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/${id}`, data);
  },
  deleteCourse(id: string) {
    return lmsService.delete(`${BASE_URL}/${id}`);
  },
  getCourseOverView(id: string) {
    return lmsService.get(`${BASE_URL}/overview/${id}`);
  },
  enroll(courseId : string) {
    return lmsService.post(ENROLL_BASE_URL, {courseId});
  }
};