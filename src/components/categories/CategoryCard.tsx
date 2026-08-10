import { Pencil, Trash2, RotateCcw, Trash, FolderTree, ChevronRight, Eye } from "lucide-react";
import type { categoryIF } from "../../interface/data/category";
import { CategoryLevel } from "../../enums/category.enum";
import StatusToggle from "../common/StatusToggle";

interface CategoryCardProps {
  category: categoryIF;
  parentName?: string;
  trashView?: boolean;
  onView: (category: categoryIF) => void;
  onEdit: (category: categoryIF) => void;
  onDelete: (category: categoryIF) => void;
  onToggleActive: (category: categoryIF) => void;
  onRestore: (category: categoryIF) => void;
  onPermanentDelete: (category: categoryIF) => void;
}

const LEVEL_META: Record<string, { label: string; style: string }> = {
  [CategoryLevel.ROOT]: { label: "Root", style: "bg-violet-500 text-white" },
  [CategoryLevel.CHILD]: { label: "Child", style: "bg-sky-500 text-white" },
  [CategoryLevel.GRANDCHILD]: { label: "Sub-child", style: "bg-emerald-500 text-white" },
};

const CategoryCard = ({ category, parentName, trashView = false, onView, onEdit, onDelete, onToggleActive, onRestore, onPermanentDelete }: CategoryCardProps) => {
  const meta = LEVEL_META[category.level];

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="relative h-28 w-full overflow-hidden cursor-pointer bg-green-100" onClick={() => onView(category)}>
        {category.avatar?.URL ? (
          <img src={category.avatar.URL} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderTree className="h-10 w-10 " />
          </div>
        )}

        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow ${meta.style}`}>
          {meta.label}
        </span>

        {!trashView && (
          <div
            className="absolute right-3 top-3 rounded-full bg-white/90 px-1.5 py-1 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <StatusToggle isActive={category.isActive} onToggle={() => onToggleActive(category)} activeLabel="" inactiveLabel="" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="min-w-0 cursor-pointer" onClick={() => onView(category)}>
          <p className="truncate text-sm font-semibold hover:underline" style={{ color: "var(--text-primary)" }}>{category.name}</p>
          {parentName && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
              {parentName} <ChevronRight className="h-3 w-3 shrink-0" />
            </p>
          )}
        </div>

        {category.description && (
          <p className="line-clamp-2 text-xs" style={{ color: "var(--text-muted)" }}>{category.description}</p>
        )}

        <code className="w-fit rounded-md px-2 py-0.5 text-[11px]" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
          /{category.slug}
        </code>

        <div className="mt-auto flex items-center justify-end gap-1 pt-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {trashView ? (
            <>
              <button onClick={() => onRestore(category)} title="Restore" className="rounded-lg p-2 cursor-pointer hover:bg-(--bg-soft)">
                <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
              </button>
              <button onClick={() => onPermanentDelete(category)} title="Delete permanently" className="rounded-lg p-2 cursor-pointer hover:bg-(--bg-soft)">
                <Trash className="h-4 w-4" style={{ color: "var(--error)" }} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onView(category)} title="View" className="rounded-lg p-2 cursor-pointer hover:bg-(--bg-soft)">
                <Eye className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
              </button>
              <button onClick={() => onEdit(category)} title="Edit" className="rounded-lg p-2 cursor-pointer hover:bg-(--bg-soft)">
                <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
              </button>
              <button onClick={() => onDelete(category)} title="Delete" className="rounded-lg p-2 cursor-pointer hover:bg-(--bg-soft)">
                <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;