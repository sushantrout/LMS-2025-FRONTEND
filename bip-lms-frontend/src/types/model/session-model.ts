import { Attachment } from "./attachment-model";

export type Session = MasterData & {
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