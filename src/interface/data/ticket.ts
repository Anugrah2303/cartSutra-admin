import type avatarIF from "./avatar";
import type { TicketStatus, TicketPriority, TicketCategory } from "../../enums/ticket.enum";
import type { UserRole } from "../../enums/user.enum";

export interface TicketMessageIF {
  sender: string;
  senderRole: UserRole;
  message: string;
  attachments: avatarIF[];
  createdAt: string;
}

export interface TicketListUserIF {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// shape returned by GET /tickets/admin/all (projected — no message bodies)
export interface TicketListItemIF {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  user: TicketListUserIF;
}

// shape returned by GET /tickets/:id (full thread)
export interface TicketDetailIF {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  user: TicketListUserIF & { avatar?: avatarIF };
  relatedOrder?: string | null;
  assignedTo?: string | null;
  messages: TicketMessageIF[];
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}