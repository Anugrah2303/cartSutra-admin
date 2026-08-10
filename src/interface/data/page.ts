import type { PageType } from "../../enums/page.enum";

export interface PageIF {
  _id: string;
  title: string;
  slug: string;
  content: string;
  pageType: PageType;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isPublished: boolean;
  publishedAt?: string | null;
  showInFooter: boolean;
  showInHeader: boolean;
  displayOrder: number;
  viewCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}