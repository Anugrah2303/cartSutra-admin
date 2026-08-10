import { format } from "date-fns";
import { Star, Trash2, Eye, EyeOff, Flag, MessageSquareWarning } from "lucide-react";
import type { ReviewIF } from "../../interface/data/review";

interface ReviewTableProps {
  reviews: ReviewIF[];
  onToggleApproval: (review: ReviewIF) => void;
  onResolveReport: (review: ReviewIF) => void;
  onDelete: (review: ReviewIF) => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5" style={{ color: i < rating ? "var(--warning)" : "var(--border-light)" }} fill={i < rating ? "currentColor" : "none"} />
    ))}
  </div>
);

const ReviewTable = ({ reviews, onToggleApproval, onResolveReport, onDelete }: ReviewTableProps) => {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <MessageSquareWarning className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No reviews found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Review</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Customer</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Rating</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Reports</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Date</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3 max-w-xs">
                <div className="flex items-center gap-3">
                  {review.productInfo?.thumbnailImage?.URL ? (
                    <img src={review.productInfo.thumbnailImage.URL} alt={review.productInfo.title} className="h-10 w-10 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md text-xs shrink-0" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-muted)" }}>—</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{review.productInfo?.title ?? "Product"}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{review.title || review.comment}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                {review.userInfo ? (
                  <>
                    <p style={{ color: "var(--text-primary)" }}>{review.userInfo.firstName} {review.userInfo.lastName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{review.userInfo.email}</p>
                  </>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              <td className="py-3"><StarRating rating={review.rating} /></td>
              <td className="py-3">
                {review.isReported ? (
                  <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 w-fit">
                    <Flag className="h-3 w-3" /> {review.reports.length}
                  </span>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              <td className="py-3">
                <button onClick={() => onToggleApproval(review)} className={`rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer flex items-center gap-1 w-fit ${review.isApproved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {review.isApproved ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {review.isApproved ? "Approved" : "Hidden"}
                </button>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{format(new Date(review.createdAt), "MMM d, yyyy")}</td>
              <td className="py-3">
                <div className="flex justify-end gap-1.5">
                  {review.isReported && (
                    <button onClick={() => onResolveReport(review)} title="Resolve report" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                      <Flag className="h-4 w-4" style={{ color: "var(--success)" }} />
                    </button>
                  )}
                  <button onClick={() => onDelete(review)} title="Delete review" className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
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

export default ReviewTable;