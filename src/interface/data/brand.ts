import type avatarIF from "./avatar.js";

export default interface BrandIF{
    name: string;
    slug: string;
    description?: string;
    avatar: avatarIF;
    website?: string;
    isFeatured: boolean;
    isDeleted: boolean;
    _id: string
    createdAt: Date
    updatedAt: Date
}