import { TICKET_STATUS_STYLES } from "./ticketStyles";

const TicketStatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TICKET_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status.replace(/_/g, " ")}
  </span>
);

export default TicketStatusBadge;