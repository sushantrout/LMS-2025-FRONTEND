import { lmsService } from "./lms-service";

const BASE_URL = "v1/application-users";

export const usersService = {
  getApplcationUsersList(id: string) {
    return lmsService.get(`${BASE_URL}/course/${id}`);
  },
  getApplicationUser(id: string) {
    return lmsService.get(`${BASE_URL}/${id}`);
  },
  createApplicationUser(data: any) {
    return lmsService.post(`${BASE_URL}`, data);
  },
  updateApplcationUser(id: string, data: any) {
    return lmsService.put(`${BASE_URL}/${id}`, data);
  },
  deleteApplicationUser(id: string) {
    return lmsService.delete(`${BASE_URL}/delete/${id}`);
  },

};