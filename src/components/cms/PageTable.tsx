import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { PageIF } from "../../interface/data/page";

interface PageTableProps {
  pages: PageIF[];
  onEdit: (page: PageIF) => void;
  onDelete: (page: PageIF) => void;
  onTogglePublish: (page: PageIF) => void;
}

const PageTable = ({ pages, onEdit, onDelete, onTogglePublish }: PageTableProps) => {
  if (pages.length === 0) return <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>No pages found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Page</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Type</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Views</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Published</th>
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <p style={{ color: "var(--text-primary)" }}>{page.title}</p>
                <code className="text-xs" style={{ color: "var(--text-muted)" }}>/{page.slug}</code>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{page.pageType}</td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{page.viewCount}</td>
              <td className="py-3">
                <button onClick={() => onTogglePublish(page)} className="flex items-center gap-1.5 cursor-pointer">
                  {page.isPublished ? <ToggleRight className="h-5 w-5" style={{ color: "var(--success)" }} /> : <ToggleLeft className="h-5 w-5" style={{ color: "var(--text-muted)" }} />}
                </button>
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(page)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
                    <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                  </button>
                  <button onClick={() => onDelete(page)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer">
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

export default PageTable;