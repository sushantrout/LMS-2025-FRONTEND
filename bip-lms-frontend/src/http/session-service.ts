import { httpClient } from "./http-service";
import { lmsService } from "./lms-service";

const BASE_URL = "v1/sessions";

export const sessionService = {
  getSessionListByCourseId() {
    return lmsService.get(`${BASE_URL}`);
  },
  getSessionListByModuleId(id: string) {
    return lmsService.get(`${BASE_URL}/module/${id}`);
  },
  createSession(data: any) {
    return lmsService.post(`${BASE_URL}`, data);
  },
  updateSession(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/${id}`, data);
  },
  deleteSession(id: string) {
    return lmsService.delete(`${BASE_URL}/${id}`);
  },

};