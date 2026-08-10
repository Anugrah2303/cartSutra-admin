import { useRef, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Paperclip, UserPlus } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import { TICKET_STATUS_OPTIONS, TICKET_PRIORITY_OPTIONS } from "./ticketStyles";
import {
  useGetTicketById,
  useAssignTicket,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useReplyTicket,
} from "../../hooks/queries/ticket.queries";
import { useGetUser } from "../../hooks/queries/auth.queries";
import type { UserIF } from "../../interface/data/user";
import { UserRole } from "../../enums/user.enum";

interface TicketDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
}

const TicketDetailModal = ({ ticketId, onClose }: TicketDetailModalProps) => {
  const { data, isLoading } = useGetTicketById(ticketId);
  const { data: currentUserData } = useGetUser<UserIF>();
  const currentUser = currentUserData?.data;

  const assignTicket = useAssignTicket();
  const updateStatus = useUpdateTicketStatus();
  const updatePriority = useUpdateTicketPriority();
  const replyTicket = useReplyTicket();

  const [replyText, setReplyText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const ticket = data?.data;

  if (!ticketId) return null;

  const handleAssignToMe = () => {
    assignTicket.mutate({ id: ticketId }, {
      onSuccess: () => toast.success("Ticket assigned to you"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ id: ticketId, status: status as never }, {
      onSuccess: () => toast.success("Status updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handlePriorityChange = (priority: string) => {
    updatePriority.mutate({ id: ticketId, priority: priority as never }, {
      onSuccess: () => toast.success("Priority updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleReply = () => {
    if (replyText.trim().length < 1) {
      toast.error("Reply message cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("message", replyText.trim());
    attachments.forEach((file) => formData.append("attachments", file));

    replyTicket.mutate({ id: ticketId, data: formData }, {
      onSuccess: () => { setReplyText(""); setAttachments([]); toast.success("Reply sent"); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Modal open={!!ticketId} title={ticket ? `Ticket #${ticket.ticketNumber}` : "Loading ticket..."} onClose={onClose} maxWidth="max-w-3xl">
      {isLoading || !ticket ? (
        <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <div className="flex flex-col gap-6">

          <div className="flex flex-wrap items-center gap-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{ticket.category}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Opened {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>SUBJECT</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{ticket.subject}</p>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>CUSTOMER</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{ticket.user.firstName} {ticket.user.lastName}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{ticket.user.email}</p>
          </div>

          {/* message thread */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>CONVERSATION</p>
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
              {ticket.messages.map((msg, idx) => {
                const isAdmin = msg.senderRole === UserRole.ADMIN;
                return (
                  <div key={idx} className={`flex flex-col gap-1 rounded-xl border p-3 ${isAdmin ? "ml-6" : "mr-6"}`} style={{ borderColor: "var(--border-light)", backgroundColor: isAdmin ? "var(--bg-soft)" : "var(--bg-card)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: isAdmin ? "var(--color-primary)" : "var(--text-secondary)" }}>
                        {isAdmin ? "Support" : `${ticket.user.firstName}`}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{format(new Date(msg.createdAt), "MMM d, h:mm a")}</span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>{msg.message}</p>
                    {msg.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.attachments.map((img, i) => (
                          <a key={i} href={img.URL} target="_blank" rel="noreferrer">
                            <img src={img.URL} alt={`attachment-${i}`} className="h-14 w-14 rounded-md object-cover border" style={{ borderColor: "var(--border-light)" }} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* reply box */}
          {ticket.status !== "CLOSED" && (
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>REPLY</p>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border-light)", color: "var(--text-primary)" }}
              />

              <div className="flex items-center justify-between mt-2">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>
                  <Paperclip className="h-3.5 w-3.5" />
                  {attachments.length > 0 ? `${attachments.length} file(s) attached` : "Attach files"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => setAttachments(Array.from(e.target.files ?? []))} />

                <Button value={replyTicket.isPending ? "Sending..." : "Send reply"} disable={replyTicket.isPending} onClick={handleReply} />
              </div>
            </div>
          )}

          {/* assignment & controls */}
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>MANAGE</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Status</label>
                <select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm capitalize" style={{ borderColor: "var(--border-light)" }}>
                  {TICKET_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ").toLowerCase()}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Priority</label>
                <select value={ticket.priority} onChange={(e) => handlePriorityChange(e.target.value)} className="w-full mt-1 rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border-light)" }}>
                  {TICKET_PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                {ticket.assignedTo === currentUser?._id ? (
                  <p className="text-xs py-2" style={{ color: "var(--success)" }}>Assigned to you</p>
                ) : (
                  <Button value="Assign to me" Icon={UserPlus} options={{ className: "h-3.5 w-3.5 inline mr-1" }} variant="secondary" disable={assignTicket.isPending} onClick={handleAssignToMe} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TicketDetailModal;