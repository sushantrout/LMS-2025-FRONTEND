import { lmsService } from "./lms-service";

const BASE_URL = "v1/question";

export const questionService = {
  createQuestioner(sessionId: string, data: any) {
    return lmsService.post(`${BASE_URL}/create-questioner/${sessionId}`, data);
  }, 
  getQuestioner(sessionId: string) {
    return lmsService.get(`${BASE_URL}/get-questions-by-session-id/${sessionId}`);
  }
}