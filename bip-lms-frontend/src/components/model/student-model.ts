export interface Student {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    isActive: boolean;
    isDeleted: boolean;
}
