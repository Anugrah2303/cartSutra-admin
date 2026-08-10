export enum NotificationType {
    ORDER = "ORDER",
    PAYMENT = "PAYMENT",
    PRODUCT = "PRODUCT",
    VENDOR = "VENDOR",
    RETURN = "RETURN",
    REFUND = "REFUND",
    PROMOTION = "PROMOTION",
    SYSTEM = "SYSTEM",
}

export enum NotificationAudience {
    USER = "USER",
    ROLE = "ROLE",
    ALL = "ALL",
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  audience: NotificationAudience;
  role?: string;
  user?: string;
}