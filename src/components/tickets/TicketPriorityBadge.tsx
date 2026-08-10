import { TICKET_PRIORITY_STYLES } from "./ticketStyles";

const TicketPriorityBadge = ({ priority }: { priority: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TICKET_PRIORITY_STYLES[priority] ?? "bg-gray-100 text-gray-600"}`}>
    {priority}
  </span>
);

export default TicketPriorityBadge;