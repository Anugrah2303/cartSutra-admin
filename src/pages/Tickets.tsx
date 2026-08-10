import { useMemo, useState } from "react";
import { LifeBuoy, Clock, Loader2, CheckCircle2 } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import TicketFilters from "../components/tickets/TicketFilters";
import TicketTable from "../components/tickets/TicketTable";
import TicketDetailModal from "../components/tickets/TicketDetailModal";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import { useGetTickets, type TicketFiltersParams } from "../hooks/queries/ticket.queries";
import type { TicketListItemIF } from "../interface/data/ticket";
import { TicketStatus } from "../enums/ticket.enum";

const Tickets = () => {
  const [filters, setFilters] = useState<TicketFiltersParams>({ page: 1, limit: 10 });
  const [viewingTicketId, setViewingTicketId] = useState<string | null>(null);

  const { data, isLoading } = useGetTickets(filters);

  const tickets: TicketListItemIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? tickets.length;
    const open = tickets.filter((t) => t.status === TicketStatus.OPEN).length;
    const inProgress = tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length;
    const resolved = tickets.filter((t) => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED).length;
    return { total, open, inProgress, resolved };
  }, [tickets, meta]);

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Support Tickets" subtitle="Respond to customer and vendor support requests" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Tickets" value={stats.total} Icon={LifeBuoy} color="blue" subtext="All tickets" />
          <SummaryStatCard label="Open" value={stats.open} Icon={Clock} color="amber" subtext="Awaiting response" />
          <SummaryStatCard label="In Progress" value={stats.inProgress} Icon={Loader2} color="indigo" subtext="Being worked on" />
          <SummaryStatCard label="Resolved / Closed" value={stats.resolved} Icon={CheckCircle2} color="green" subtext="This page" />
        </SummaryStatsGrid>
      )}

      <Card>
        {isLoading ? (
          <>
            <SkeletonFilters />
            <SkeletonTable rows={8} columns={7} hasAvatar={false} />
          </>
        ) : (
          <>
            <TicketFilters filters={filters} onChange={setFilters} />
            <TicketTable tickets={tickets} onView={(t) => setViewingTicketId(t._id)} />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <TicketDetailModal ticketId={viewingTicketId} onClose={() => setViewingTicketId(null)} />
    </div>
  );
};

export default Tickets;