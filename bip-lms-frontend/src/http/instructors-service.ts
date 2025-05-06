import { lmsService } from "./lms-service";

const BASE_URL = "v1/application-users";

export const instructorService = {
  getUserList() {
    return lmsService.get(`${BASE_URL}`);
  }

};