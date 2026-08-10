import type { NotificationType, NotificationAudience } from "../../enums/notification.enum";
import type { UserRole } from "../../enums/user.enum";

export interface NotificationIF {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  audience: NotificationAudience;
  user?: string | null;
  role?: UserRole | null;
  link?: string | null;
  createdBy?: string | null;
  isDeleted: boolean;
  isRead?: boolean; 
  createdAt: string;
  updatedAt: string;
}