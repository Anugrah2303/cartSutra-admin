import type { GiftCardStatus } from "../../enums/giftCard.enum";

export interface GiftCardIF {
  _id: string;
  code: string;
  initialBalance: number;
  balance: number;
  issuedTo?: string | null;
  purchasedBy?: string | null;
  status: GiftCardStatus;
  expiryDate: string;
  redeemedBy: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}