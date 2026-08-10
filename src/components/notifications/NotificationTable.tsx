import { format } from "date-fns";
import { Trash2, Bell } from "lucide-react";
import type { NotificationIF } from "../../interface/data/notification";
import { NotificationAudience } from "../../enums/notification.enum";

interface NotificationTableProps {
  notifications: NotificationIF[];
  onDelete: (notification: NotificationIF) => void;
}

const TYPE_STYLES: Record<string, string> = {
  ORDER: "bg-blue-100 text-blue-700",
  PAYMENT: "bg-green-100 text-green-700",
  PRODUCT: "bg-purple-100 text-purple-700",
  VENDOR: "bg-indigo-100 text-indigo-700",
  RETURN: "bg-orange-100 text-orange-700",
  REFUND: "bg-orange-100 text-orange-700",
  PROMOTION: "bg-pink-100 text-pink-700",
  SYSTEM: "bg-gray-100 text-gray-600",
};

const NotificationTable = ({ notifications, onDelete }: NotificationTableProps) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <Bell className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No notifications found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Notification</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Type</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Audience</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Sent</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3 max-w-xs">
                <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{n.title}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{n.message}</p>
              </td>
              <td className="py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_STYLES[n.type] ?? "bg-gray-100 text-gray-600"}`}>{n.type}</span>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                {n.audience}{n.audience === NotificationAudience.ROLE && n.role ? ` (${n.role})` : ""}
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(n.createdAt), "MMM d, h:mm a")}</td>
              <td className="py-3">
                <div className="flex justify-end">
                  <button onClick={() => onDelete(n)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
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

export default NotificationTable;