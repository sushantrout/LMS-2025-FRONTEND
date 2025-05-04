import { Attachment } from "./attachment-model";
import { SessionOverview} from "./session-overview-model";

export type ModuleOverview = {
    moduleId: string;
    moduleName: string;
    moduleDescription: string;
    moduleType: string;
    moduleStatus: string;
    moduleStartDate: string;
    moduleEndDate: string;
    moduleDuration: string;
    moduleLocation: string;
    coverImage: Attachment;
    noOfSessions: number;
    sessions: SessionOverview[];
  };