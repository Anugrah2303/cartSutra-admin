import { format } from "date-fns";
import { Ban, CheckCircle2, Mail, Phone, Users } from "lucide-react";
import type { CustomerIF } from "../../interface/data/customer";
import { AccountStatus } from "../../enums/user.enum";

interface CustomerTableProps {
  customers: CustomerIF[];
  onToggleBlock: (customer: CustomerIF) => void;
}

const STATUS_STYLES: Record<string, string> = {
  [AccountStatus.ACTIVE]: "bg-green-100 text-green-700",
  [AccountStatus.PENDING]: "bg-amber-100 text-amber-700",
  [AccountStatus.BLOCKED]: "bg-red-100 text-red-700",
  [AccountStatus.SUSPENDED]: "bg-red-100 text-red-700",
  [AccountStatus.DELETED]: "bg-gray-100 text-gray-600",
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
      <Users className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
    </div>
    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No customers found</p>
    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filters.</p>
  </div>
);

const CustomerTable = ({ customers, onToggleBlock }: CustomerTableProps) => {
  if (customers.length === 0) return <EmptyState />;

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Customer</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Contact</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Verified</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Joined</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Last login</th>
              <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {customer.avatar?.URL ? (
                      <img src={customer.avatar.URL} alt={customer.firstName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                        {customer.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ color: "var(--text-primary)" }}>{customer.firstName} {customer.lastName}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>@{customer.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <Mail className="h-3.5 w-3.5" /> {customer.email}
                  </p>
                  {customer.phone && (
                    <p className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <Phone className="h-3.5 w-3.5" /> {customer.phone}
                    </p>
                  )}
                </td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${customer.isEmailVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {customer.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[customer.accountStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    {customer.accountStatus}
                  </span>
                </td>
                <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {format(new Date(customer.createdAt), "MMM d, yyyy")}
                </td>
                <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {customer.lastLoginAt ? format(new Date(customer.lastLoginAt), "MMM d, h:mm a") : "Never"}
                </td>
                <td className="py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => onToggleBlock(customer)}
                      title={customer.accountStatus === AccountStatus.BLOCKED ? "Unblock customer" : "Block customer"}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-(--bg-soft)"
                      style={{ color: customer.accountStatus === AccountStatus.BLOCKED ? "var(--success)" : "var(--error)" }}
                    >
                      {customer.accountStatus === AccountStatus.BLOCKED ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      {customer.accountStatus === AccountStatus.BLOCKED ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {customers.map((customer) => (
          <div key={customer._id} className="rounded-xl border p-4" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {customer.avatar?.URL ? (
                  <img src={customer.avatar.URL} alt={customer.firstName} className="h-10 w-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shrink-0" style={{ background: "var(--gradient-primary)" }}>
                    {customer.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{customer.firstName} {customer.lastName}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{customer.email}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[customer.accountStatus] ?? "bg-gray-100 text-gray-600"}`}>
                {customer.accountStatus}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Joined {format(new Date(customer.createdAt), "MMM d, yyyy")}</span>
              <span className={customer.isEmailVerified ? "text-(--success)" : ""}>{customer.isEmailVerified ? "Verified" : "Unverified"}</span>
            </div>

            <button
              onClick={() => onToggleBlock(customer)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium cursor-pointer"
              style={{
                color: customer.accountStatus === AccountStatus.BLOCKED ? "var(--success)" : "var(--error)",
                backgroundColor: "var(--bg-soft)",
              }}
            >
              {customer.accountStatus === AccountStatus.BLOCKED ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
              {customer.accountStatus === AccountStatus.BLOCKED ? "Unblock customer" : "Block customer"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerTable;