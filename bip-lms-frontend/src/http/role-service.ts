import { lmsService } from "./lms-service";

const BASE_URL = "v1/application-roles";

export const roleService = {
  getApplicationRoles() {
    return lmsService.get(`${BASE_URL}`);
  },
}