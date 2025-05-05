import { Attachment } from "./attachment-model";

export type Session = MasterData & {
    description?: string;
    mode?: 'ONLINE' | 'OFFLINE' | string;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    link?: string;
    attachment?: Attachment;
    moduleId?: string;
    moduleName?: string;
    sortOrder?: number;
    duration?: number;
  };

  export const initialSession: Session = {
    sortOrder: 1,
    id: "",
    name: "",
    description: "",
    mode: "ONLINE",
    startTime: null,
    endTime: null,
  } 