import type { AccountStatus, AuthProvider, UserRole } from "../../enums/user.enum.js";
import type { AddressIF } from "./address.js";
import type avatarIF from "./avatar.js";

export interface UserIF extends Document {
  _id: string
  firstName: string;
  lastName: string;
  username: string;

  email: string;
  emailVerificationOtp: string,
  emailVerificationOtpExpiresAt: Date | ""
  isEmailVerified: boolean;

  password: string;
  passwordResetOtp: string
  passwordResetOtpExpiry: Date | ""

  promotedBy?: string | null;
  promotedAt?: Date | null;

  phone?: string;

  role: UserRole;
  isSuperAdmin: boolean;

  provider: AuthProvider;

  avatar: avatarIF;

  addresses: AddressIF[]

  accountStatus: AccountStatus;

  loginAttempts: number;

  lockUntil?: Date;

  lastLoginAt?: Date;

  isDeleted: boolean
  deletedAt?: Date;
  createdAt: Date
  updatedAt: Date
}