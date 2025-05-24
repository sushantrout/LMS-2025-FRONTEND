import { EnrollmentCourse } from "@/types/model/enrollment-course";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/course";
const ENROLL_BASE_URL = "v1/enrollment-course";

export const courseService = {
  getCourseList(searchKey?: string, sort?: string) {
    let url = BASE_URL;
    const params = new URLSearchParams();

    if (searchKey) {
      params.append("searchKey", searchKey);
    }

    if (sort) {
      params.append("sort", sort);
    } else {
      params.append("sort", "name");
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return lmsService.get(url);
  },
  getCourseDetail(id: string) {
    return lmsService.get(`${BASE_URL}/${id}`);
  },
  createCourse(data: any) {
    debugger;
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
  enroll(courseId: string) {
    return lmsService.post(ENROLL_BASE_URL, { courseId });
  },
  getEnrolledCourse() {
    return lmsService.get(`${ENROLL_BASE_URL}/enrolled-course`);
  },
  getEnrollmentStatus(courseId: string) {
    return lmsService.get(`${BASE_URL}/${courseId}/enroll-status`);
  },

  enrollUsers(data: EnrollmentCourse) {
    return lmsService.post(`${ENROLL_BASE_URL}`, data);
  },
};
