import { Attachment } from "./attachment-model";

export type Event = {
    id: string;
    name: string;
    description: string;
    mode: 'ONLINE' | 'OFFLINE' | string;
    startTime: string;
    endTime: string;
    location: string;
    link: string;
    attachment: Attachment;
    moduleId: string;
    moduleName: string;
  };