import { format } from "date-fns";
import { UserMinus, ShieldCheck } from "lucide-react";
import type { AdminIF } from "../../interface/data/admin";
import { AccountStatus } from "../../enums/user.enum";

interface AdminTableProps {
  admins: AdminIF[];
  currentUserId?: string;
  canManage: boolean;
  onDemote: (admin: AdminIF) => void;
}

const STATUS_STYLES: Record<string, string> = {
  [AccountStatus.ACTIVE]: "bg-green-100 text-green-700",
  [AccountStatus.PENDING]: "bg-amber-100 text-amber-700",
  [AccountStatus.BLOCKED]: "bg-red-100 text-red-700",
  [AccountStatus.SUSPENDED]: "bg-red-100 text-red-700",
  [AccountStatus.DELETED]: "bg-gray-100 text-gray-600",
};

const AdminTable = ({ admins, currentUserId, canManage, onDemote }: AdminTableProps) => {
  if (admins.length === 0) {
    return <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>No admins found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Admin</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Promoted by</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Last login</th>
            {canManage && <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {admin.avatar?.URL ? (
                    <img src={admin.avatar.URL} alt={admin.firstName} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                      {admin.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                      {admin.firstName} {admin.lastName}
                      {admin.isSuperAdmin && <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />}
                      {admin._id === currentUserId && <span className="text-xs" style={{ color: "var(--text-muted)" }}>(you)</span>}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{admin.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[admin.accountStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {admin.accountStatus}
                </span>
              </td>
              <td className="py-3">
                {admin.promotedByUser ? (
                  <div>
                    <p style={{ color: "var(--text-primary)" }}>{admin.promotedByUser.firstName} {admin.promotedByUser.lastName}</p>
                    {admin.promotedAt && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{format(new Date(admin.promotedAt), "MMM d, yyyy")}</p>}
                  </div>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                {admin.lastLoginAt ? format(new Date(admin.lastLoginAt), "MMM d, h:mm a") : "Never"}
              </td>
              {canManage && (
                <td className="py-3">
                  <div className="flex justify-end">
                    {admin._id !== currentUserId && !admin.isSuperAdmin && (
                      <button onClick={() => onDemote(admin)} className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-(--bg-soft)" style={{ color: "var(--error)" }}>
                        <UserMinus className="h-3.5 w-3.5" />
                        Remove admin
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;