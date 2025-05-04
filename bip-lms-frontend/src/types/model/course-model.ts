import { Category } from "./category-model";

export type Course = MasterData &  {
    description?: string,
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
}