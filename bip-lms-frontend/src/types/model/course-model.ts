import { Category } from "./category-model";

export type Course = MasterData &  {
    description?: any,
    category ?: Category,
    courseType ?: string,
    noOfModule?: number,
    maxRating ?: number
    duration ?: string,
    lessons ?: string,
    modules?: any[],
    assgnments?: any[],
    pricing?: any,
    comments?: any[],
    image?: string,
    instructors?: User[],
}

export const initialFormData: Course = {
    name: "",
    description: "",
    category: null,
    courseType: "FREE",
    maxRating: 0,
    duration: "",
    lessons: "",
    pricing: null,
    instructors: [],
  }