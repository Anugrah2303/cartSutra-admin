import type avatarIF from "./avatar";
import type { AccountStatus } from "../../enums/user.enum";

export interface PromotedByIF {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminIF {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: avatarIF;
  isSuperAdmin: boolean;
  accountStatus: AccountStatus;
  lastLoginAt?: string;
  promotedAt?: string;
  promotedByUser?: PromotedByIF;
  createdAt: string;
}

export interface PromotableUserIF {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  avatar?: avatarIF;
}