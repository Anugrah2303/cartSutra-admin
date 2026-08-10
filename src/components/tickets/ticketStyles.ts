import { TicketStatus, TicketPriority } from "../../enums/ticket.enum";

export const TICKET_STATUS_STYLES: Record<string, string> = {
    [TicketStatus.OPEN]: "bg-amber-100 text-amber-700",
    [TicketStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700",
    [TicketStatus.RESOLVED]: "bg-green-100 text-green-700",
    [TicketStatus.CLOSED]: "bg-gray-100 text-gray-600",
};

export const TICKET_PRIORITY_STYLES: Record<string, string> = {
    [TicketPriority.LOW]: "bg-gray-100 text-gray-600",
    [TicketPriority.MEDIUM]: "bg-blue-100 text-blue-700",
    [TicketPriority.HIGH]: "bg-amber-100 text-amber-700",
    [TicketPriority.URGENT]: "bg-red-100 text-red-700",
};

export const TICKET_STATUS_OPTIONS = Object.values(TicketStatus);
export const TICKET_PRIORITY_OPTIONS = Object.values(TicketPriority);