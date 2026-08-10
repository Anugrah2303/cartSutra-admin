import type avatarIF from "./avatar";
import type { BlogStatus } from "../../enums/blog.enum";

export interface BlogIF {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  coverImage: avatarIF;
  author: string;
  category?: string;
  tags: string[];
  status: BlogStatus;
  publishedAt?: string | null;
  views: number;
  readTime: number;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}