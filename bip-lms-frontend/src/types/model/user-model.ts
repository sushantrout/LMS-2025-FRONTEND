import { Attachment } from "./attachment-model";
import { Role } from "./role-model";

export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  applicationRole: Role;
  profilePicture: Attachment;
  fullName: string;
}