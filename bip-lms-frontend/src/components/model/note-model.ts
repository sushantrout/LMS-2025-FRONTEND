import { Session } from "inspector/promises";
import { Attachment } from "./attachment-model";

export type Event = {
    id: string;
    title: string;
    content: string;
    attachment: Attachment;
    session: Session;
  };