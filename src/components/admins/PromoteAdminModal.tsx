import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import Modal from "../common/Modal";
import { useSearchPromotableUsers, usePromoteToAdmin } from "../../hooks/queries/admin.queries";
import type { PromotableUserIF } from "../../interface/data/admin";
import { toast } from "sonner";

interface PromoteAdminModalProps {
  open: boolean;
  onClose: () => void;
}

const PromoteAdminModal = ({ open, onClose }: PromoteAdminModalProps) => {
  const [search, setSearch] = useState("");
  const { data, isFetching } = useSearchPromotableUsers(search);
  const promote = usePromoteToAdmin();

  const users: PromotableUserIF[] = Array.isArray(data?.data) ? data.data : [];

  const handlePromote = (user: PromotableUserIF) => {
    promote.mutate(user._id, {
      onSuccess: () => { toast.success(`${user.firstName} ${user.lastName} is now an admin`); onClose(); setSearch(""); },
    });
  };

  return (
    <Modal open={open} title="Promote user to admin" onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 mb-4" style={{ borderColor: "var(--border-light)" }}>
        <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username, or email..."
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
          autoFocus
        />
      </div>

      {search.trim().length < 2 ? (
        <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>Type at least 2 characters to search</p>
      ) : isFetching ? (
        <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>Searching...</p>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>No matching users found</p>
      ) : (
        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between rounded-md p-2 hover:bg-(--bg-soft)">
              <div className="flex items-center gap-3">
                {user.avatar?.URL ? (
                  <img src={user.avatar.URL} alt={user.firstName} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user.firstName} {user.lastName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email} · {user.role}</p>
                </div>
              </div>

              <button
                onClick={() => handlePromote(user)}
                disabled={promote.isPending}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Promote
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default PromoteAdminModal;