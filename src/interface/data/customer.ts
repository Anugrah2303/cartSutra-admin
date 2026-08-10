import type avatarIF from "./avatar";
import type { AccountStatus } from "../../enums/user.enum";

export interface CustomerIF {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: avatarIF;
  accountStatus: AccountStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}