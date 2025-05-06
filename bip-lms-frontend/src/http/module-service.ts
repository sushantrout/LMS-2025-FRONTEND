import { httpClient } from "./http-service";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/module";

export const moduleService = {
  getModuleByCourseId(id: string) {
    return lmsService.get(`${BASE_URL}/course/${id}`);
  },
  getModuleById(id: string) {
    return lmsService.get(`${BASE_URL}/${id}`);
  },
  createModule(data: any) {
    return lmsService.post(`${BASE_URL}`, data);
  },
  updateModule(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/${id}`, data);
  },
  deleteCourse(id: string) {
    return lmsService.delete(`${BASE_URL}/delete/${id}`);
  },

};