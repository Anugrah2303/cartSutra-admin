import type avatarIF from "./avatar.js";
import type { CategoryLevel } from "../../enums/category.enum.js";

export interface categoryIF {
    _id: string
    parent: string | null;
    name: string;
    slug: string;
    description?: string;
    avatar?: avatarIF;
    level: CategoryLevel;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date,
    updatedAt: Date
}