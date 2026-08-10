import { useMemo, useState } from "react";
import { Plus, Bell, Users, UserCog, Megaphone } from "lucide-react";
import { toast } from "sonner";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationTable from "../components/notifications/NotificationTable";
import NotificationForm, { type NotificationFormOutput } from "../components/notifications/NotificationForm";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetNotifications, useCreateNotification, useDeleteNotification, type NotificationFiltersParams } from "../hooks/queries/notification.queries";
import type { NotificationIF } from "../interface/data/notification";
import { NotificationAudience } from "../enums/notification.enum";

const Notifications = () => {
  const [filters, setFilters] = useState<NotificationFiltersParams>({ page: 1, limit: 10 });
  const [formOpen, setFormOpen] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState<NotificationIF | null>(null);

  const { data, isLoading } = useGetNotifications(filters);
  const createNotification = useCreateNotification();
  const deleteNotification = useDeleteNotification();

  const notifications: NotificationIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? notifications.length;
    const toAll = notifications.filter((n) => n.audience === NotificationAudience.ALL).length;
    const toRole = notifications.filter((n) => n.audience === NotificationAudience.ROLE).length;
    const toUser = notifications.filter((n) => n.audience === NotificationAudience.USER).length;
    return { total, toAll, toRole, toUser };
  }, [notifications, meta]);

  const handleCreate = (formData: NotificationFormOutput) => {
    createNotification.mutate(formData, {
      onSuccess: () => { toast.success("Notification sent"); setFormOpen(false); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingNotification) return;
    deleteNotification.mutate(deletingNotification._id, {
      onSuccess: () => setDeletingNotification(null),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading2 title="Notifications" subtitle="Send announcements and manage notifications across the marketplace" />
        <Button value="Send notification" Icon={Plus} options={{ className: "h-4 w-4 inline mr-1" }} onClick={() => setFormOpen(true)} />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Sent" value={stats.total} Icon={Bell} color="blue" subtext="All notifications" />
          <SummaryStatCard label="Broadcast (All)" value={stats.toAll} Icon={Megaphone} color="purple" subtext="Sent to everyone" />
          <SummaryStatCard label="Role-targeted" value={stats.toRole} Icon={UserCog} color="teal" subtext="Sent to a role" />
          <SummaryStatCard label="User-targeted" value={stats.toUser} Icon={Users} color="amber" subtext="Sent to one user" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters withTabs={false} />
            <SkeletonTable rows={8} columns={5} hasAvatar={false} />
          </>
        ) : (
          <>
            <NotificationFilters filters={filters} onChange={setFilters} />
            <NotificationTable notifications={notifications} onDelete={setDeletingNotification} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <Modal open={formOpen} title="Send notification" onClose={() => setFormOpen(false)} maxWidth="max-w-lg">
        <NotificationForm loading={createNotification.isPending} onSubmit={handleCreate} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={!!deletingNotification}
        title="Delete notification"
        description={`Are you sure you want to delete "${deletingNotification?.title}"?`}
        loading={deleteNotification.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingNotification(null)}
      />
    </div>
  );
};

export default Notifications;