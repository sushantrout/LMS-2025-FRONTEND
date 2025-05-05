import { Attachment } from "./attachment-model";
import { ModuleOverview } from "./module-overview-model";


export type CourseOverView = MasterData & {
    courseId: string;
    courseName: string;
    courseDescription: string;
    attachments: Attachment[];
    modules: ModuleOverview[];
    duration:any;
    lessons:any;
  };