import { Attachment } from "./attachment-model";
import { Category } from "./category-model";
import { User } from "./user-model";

export type Course = MasterData &  {
    description?: any,
    category ?: Category,
    courseType ?: string,
    noOfModule?: number,
    rating ?: number
    duration ?: string,
    lessons ?: string,
    modules?: any[],
    assgnments?: any[],
    pricing?: any,
    comments?: any[],
    coverImage?: Attachment,
    instructors?: User[]
    progress?: number,
    shortDescription ?: string
}

export const initialCourseFormData: Course = {
    name: "",
    description: "",
    category: null,
    courseType: "FREE",
    duration: "",
    lessons: "",
    pricing: null,
    instructors: []
  }