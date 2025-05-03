export type Attachment = {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
    contentType: string;
    attachmentType: 'NOTE' | string;
    thumbnailUrl: string;
    thumbnailContentType: string;
  };
  