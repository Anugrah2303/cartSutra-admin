import { format } from "date-fns";
import { Eye, LifeBuoy } from "lucide-react";
import type { TicketListItemIF } from "../../interface/data/ticket";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";

interface TicketTableProps {
  tickets: TicketListItemIF[];
  onView: (ticket: TicketListItemIF) => void;
}

const TicketTable = ({ tickets, onView }: TicketTableProps) => {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <LifeBuoy className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No tickets found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Ticket</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Customer</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Category</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Priority</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Updated</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <button onClick={() => onView(ticket)} className="text-left cursor-pointer">
                  <p className="font-medium hover:underline" style={{ color: "var(--text-primary)" }}>#{ticket.ticketNumber}</p>
                  <p className="text-xs truncate max-w-xs" style={{ color: "var(--text-muted)" }}>{ticket.subject}</p>
                </button>
              </td>
              <td className="py-3">
                {ticket.user ? (
                  <>
                    <p style={{ color: "var(--text-primary)" }}>{ticket.user.firstName} {ticket.user.lastName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ticket.user.email}</p>
                  </>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{ticket.category}</td>
              <td className="py-3"><TicketPriorityBadge priority={ticket.priority} /></td>
              <td className="py-3"><TicketStatusBadge status={ticket.status} /></td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(ticket.updatedAt), "MMM d, h:mm a")}</td>
              <td className="py-3">
                <div className="flex justify-end">
                  <button onClick={() => onView(ticket)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" title="View ticket">
                    <Eye className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;