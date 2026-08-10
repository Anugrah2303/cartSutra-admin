import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MessageSquareWarning, Flag, EyeOff, Star } from "lucide-react";
import Card from "../components/common/Card";
import Heading2 from "../components/common/Headings/Heading2";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SummaryStatCard from "../components/common/SummaryStatCard";
import SummaryStatsGrid from "../components/common/SummaryStatsGrid";
import Pagination from "../components/common/Pagination";
import ReviewFilters from "../components/reviews/ReviewFilters";
import ReviewTable from "../components/reviews/ReviewTable";
import SkeletonStatsGrid from "../components/common/skeletons/SkeletonStatsGrid";
import SkeletonFilters from "../components/common/skeletons/SkeletonFilters";
import SkeletonTable from "../components/common/skeletons/SkeletonTable";
import {
  useGetReviews,
  useGetReportedReviews,
  useToggleReviewApproval,
  useResolveReport,
  useAdminDeleteReview,
  type ReviewFiltersParams,
} from "../hooks/queries/review.queries";
import type { ReviewIF } from "../interface/data/review";

const TABS = [
  { label: "All Reviews", value: "all" },
  { label: "Reported", value: "reported" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

const Reviews = () => {
  const [tab, setTab] = useState<TabValue>("all");
  const [filters, setFilters] = useState<ReviewFiltersParams>({ page: 1, limit: 10 });
  const [resolvingReview, setResolvingReview] = useState<ReviewIF | null>(null);
  const [deletingReview, setDeletingReview] = useState<ReviewIF | null>(null);

  const allReviewsQuery = useGetReviews(filters);
  const reportedReviewsQuery = useGetReportedReviews({ page: filters.page, limit: filters.limit });

  const { data, isLoading } = tab === "all" ? allReviewsQuery : reportedReviewsQuery;

  const toggleApproval = useToggleReviewApproval();
  const resolveReport = useResolveReport();
  const deleteReview = useAdminDeleteReview();

  const reviews: ReviewIF[] = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const stats = useMemo(() => {
    const total = meta?.total ?? reviews.length;
    const reported = reviews.filter((r) => r.isReported).length;
    const hidden = reviews.filter((r) => !r.isApproved).length;
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    return { total, reported, hidden, avgRating };
  }, [reviews, meta]);

  const handleTabChange = (value: TabValue) => {
    setTab(value);
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const handleToggleApproval = (review: ReviewIF) => {
    toggleApproval.mutate(review._id, {
      onSuccess: () => toast.success(review.isApproved ? "Review hidden" : "Review approved"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleResolveConfirm = () => {
    if (!resolvingReview) return;
    resolveReport.mutate(resolvingReview._id, {
      onSuccess: () => { toast.success("Report resolved"); setResolvingReview(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingReview) return;
    deleteReview.mutate(deletingReview._id, {
      onSuccess: () => { toast.success("Review deleted"); setDeletingReview(null); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Heading2 title="Reviews" subtitle="Moderate product reviews and resolve reported content" />
      </div>

      {isLoading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <SummaryStatsGrid>
          <SummaryStatCard label="Total Reviews" value={stats.total} Icon={MessageSquareWarning} color="blue" subtext="All reviews" />
          <SummaryStatCard label="Reported (page)" value={stats.reported} Icon={Flag} color="red" subtext="Flagged by users" />
          <SummaryStatCard label="Hidden (page)" value={stats.hidden} Icon={EyeOff} color="gray" subtext="Not publicly visible" />
          <SummaryStatCard label="Avg. Rating (page)" value={stats.avgRating.toFixed(1)} Icon={Star} color="amber" subtext="Out of 5" />
        </SummaryStatsGrid>
      )}

      <div className="flex gap-1 mb-4 border-b overflow-x-auto" style={{ borderColor: "var(--border-light)" }}>
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className="px-4 py-2.5 text-sm font-medium cursor-pointer border-b-2 -mb-px whitespace-nowrap"
            style={{
              color: tab === t.value ? "var(--color-primary)" : "var(--text-muted)",
              borderColor: tab === t.value ? "var(--color-primary)" : "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <>
            {tab === "all" && <SkeletonFilters withTabs={false} />}
            <SkeletonTable rows={8} columns={7} hasAvatar />
          </>
        ) : (
          <>
            {tab === "all" && <ReviewFilters filters={filters} onChange={setFilters} />}
            <ReviewTable
              reviews={reviews}
              onToggleApproval={handleToggleApproval}
              onResolveReport={setResolvingReview}
              onDelete={setDeletingReview}
            />
            <Pagination page={meta?.page ?? 1} totalPages={meta?.totalPages ?? 1} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!resolvingReview}
        title="Resolve report"
        description="This will clear all reports on this review and mark it as resolved. Continue?"
        loading={resolveReport.isPending}
        onConfirm={handleResolveConfirm}
        onClose={() => setResolvingReview(null)}
      />

      <ConfirmDialog
        open={!!deletingReview}
        title="Delete review"
        description="Are you sure you want to permanently delete this review? This can't be undone."
        loading={deleteReview.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingReview(null)}
      />
    </div>
  );
};

export default Reviews;