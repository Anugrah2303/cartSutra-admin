import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { BannerIF } from "../../interface/data/banner";

interface BannerTableProps {
  banners: BannerIF[];
  onEdit: (banner: BannerIF) => void;
  onDelete: (banner: BannerIF) => void;
  onToggle: (banner: BannerIF) => void;
}

const BannerTable = ({ banners, onEdit, onDelete, onToggle }: BannerTableProps) => {
  if (banners.length === 0) return <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>No banners found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Banner</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Position</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Views / Clicks</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img src={banner.image.URL} alt={banner.title} className="h-10 w-16 rounded-md object-cover" />
                  <span style={{ color: "var(--text-primary)" }}>{banner.title}</span>
                </div>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{banner.position.replace(/_/g, " ")}</td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{banner.viewCount} / {banner.clickCount}</td>
              <td className="py-3">
                <button onClick={() => onToggle(banner)} className="flex items-center gap-1.5 cursor-pointer">
                  {banner.isActive ? <ToggleRight className="h-5 w-5" style={{ color: "var(--success)" }} /> : <ToggleLeft className="h-5 w-5" style={{ color: "var(--text-muted)" }} />}
                </button>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(banner)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                  </button>
                  <button onClick={() => onDelete(banner)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
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

export default BannerTable;