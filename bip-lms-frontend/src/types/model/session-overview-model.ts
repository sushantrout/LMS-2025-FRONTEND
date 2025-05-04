import { Attachment } from "./attachment-model";

export type SessionOverview = {
    sessionId: string;
    sessionName: string;
    sessionDescription: string;
    mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    startTime: string;
    endTime: string;
    location: string;
    link: string;
    attachment: Attachment;
    moduleId: string;
    moduleName: string;
    sortOrder: number;
    duration: number;
  };