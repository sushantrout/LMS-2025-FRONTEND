import { httpClient } from "./http-service";

const BASE_URL = "course";

export const courseService = {
  getCourseList(params: any) {
    return httpClient.get(`${BASE_URL}`, { params });
  },
  getCourseDetail(id: string) {
    return httpClient.get(`${BASE_URL}/detail/${id}`);
  },
  createCourse(data: any) {
    return httpClient.post(`${BASE_URL}/create`, data);
  },
  updateCourse(id: string, data: any) {
    return httpClient.put(`${BASE_URL}/update/${id}`, data);
  },
  deleteCourse(id: string) {
    return httpClient.delete(`${BASE_URL}/delete/${id}`);
  },
};