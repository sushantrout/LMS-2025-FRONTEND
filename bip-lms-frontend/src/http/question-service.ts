import { lmsService } from "./lms-service";

const BASE_URL = "v1/question";

export const questionService = {
  createQuestioner(sessionId: string, data: any) {
    debugger;
    return lmsService.post(`${BASE_URL}/create-questioner/${sessionId}`, data);
  }
}