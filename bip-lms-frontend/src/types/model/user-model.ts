import { Attachment } from "./attachment-model";
import { Role } from "./role-model";
import { z } from "zod";

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
};

// Define the validation schema based on the DTO
export const userFormSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  applicationRole: z.object({
    id: z.string().optional(),
    name: z.string(),
  }),
  uploadedFile: z.instanceof(FileList).optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const userDefaultValues: Partial<UserFormValues> = {
  id: "",
  username: "",
  password: "",
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  applicationRole: {
    id: "",
    name: "",
  },
};


export function getUserData(userData: User) {
  return {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phoneNumber: userData.phoneNumber,
    address: userData.address,
    city: userData.city,
    state: userData.state,
    country: userData.country,
    zipCode: userData.zipCode,
    applicationRole: {
      id: userData.applicationRole?.id,
      name: userData.applicationRole?.name,
    },
  }
}
