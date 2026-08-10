import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AdminTable from "../components/admins/AdminTable";
import PromoteAdminModal from "../components/admins/PromoteAdminModal";
import Pagination from "../components/common/Pagination";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetAdmins, useDemoteAdmin } from "../hooks/queries/admin.queries";
import { useGetUser } from "../hooks/queries/auth.queries";
import type { AdminIF } from "../interface/data/admin";
import type { UserIF } from "../interface/data/user";

const PAGE_SIZE = 8;

const Admins = () => {
  const { data: currentUserData } = useGetUser<UserIF>();
  const user = currentUserData?.data;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [demotingAdmin, setDemotingAdmin] = useState<AdminIF | null>(null);

  const { data, isLoading } = useGetAdmins(search);
  const demoteAdmin = useDemoteAdmin();

  const allAdmins: AdminIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const totalPages = Math.max(1, Math.ceil(allAdmins.length / PAGE_SIZE));
  const paginatedAdmins = allAdmins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDemoteConfirm = () => {
    if (!demotingAdmin) return;
    demoteAdmin.mutate(demotingAdmin._id, {
      onSuccess: () => { toast.success(`${demotingAdmin.firstName} removed from admins`); setDemotingAdmin(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading2 title="Admins" subtitle="Manage who has administrator access to this marketplace" />
        {user?.isSuperAdmin && (
          <Button value="Promote to admin" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => setPromoteOpen(true)} />
        )}
      </div>

      {!user?.isSuperAdmin && (
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>Only super admins can promote or remove admins. You can view the list below.</p>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={5} hasAvatar />
          </>
        ) : (
          <>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border px-3 py-2 mb-5" style={{ borderColor: "var(--border-light)" }}>
              <Search className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search admins..."
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <AdminTable admins={paginatedAdmins} currentUserId={user?._id} canManage={!!user?.isSuperAdmin} onDemote={setDemotingAdmin} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>

      {user?.isSuperAdmin && <PromoteAdminModal open={promoteOpen} onClose={() => setPromoteOpen(false)} />}

      <ConfirmDialog
        open={!!demotingAdmin}
        title="Remove admin access"
        description={`Are you sure you want to remove admin access from "${demotingAdmin?.firstName} ${demotingAdmin?.lastName}"? They'll become a regular customer.`}
        loading={demoteAdmin.isPending}
        onConfirm={handleDemoteConfirm}
        onClose={() => setDemotingAdmin(null)}
      />
    </div>
  );
};

export default Admins;