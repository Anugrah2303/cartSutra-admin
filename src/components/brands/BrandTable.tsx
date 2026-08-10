import { Pencil, Trash2, Star, RotateCcw, Trash } from "lucide-react";
import type BrandIF from "../../interface/data/brand";

interface BrandTableProps {
  brands: BrandIF[];
  trashView?: boolean;
  onEdit: (brand: BrandIF) => void;
  onDelete: (brand: BrandIF) => void;
  onRestore: (brand: BrandIF) => void;
  onPermanentDelete: (brand: BrandIF) => void;
}

const BrandTable = ({ brands, trashView = false, onEdit, onDelete, onRestore, onPermanentDelete }: BrandTableProps) => {
  if (brands.length === 0) {
    return (
      <p className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        {trashView ? "No deleted brands." : "No brands found."}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Brand</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Website</th>
            {!trashView && <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Featured</th>}
            <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {brand.avatar?.URL && (
                    <img src={brand.avatar.URL} alt={brand.name} className="h-8 w-8 rounded-md object-cover" />
                  )}
                  <span style={{ color: "var(--text-primary)" }}>{brand.name}</span>
                </div>
              </td>
              <td className="py-3">
                {brand.website ? (
                  <a href={brand.website} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--color-primary)" }}>
                    {brand.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                )}
              </td>
              {!trashView && (
                <td className="py-3">
                  {brand.isFeatured && <Star className="h-4 w-4 fill-current" style={{ color: "var(--warning)" }} />}
                </td>
              )}
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  {trashView ? (
                    <>
                      <button onClick={() => onRestore(brand)} title="Restore brand" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onPermanentDelete(brand)} title="Delete permanently" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Trash className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onEdit(brand)} className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Pencil className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                      </button>
                      <button onClick={() => onDelete(brand)} className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
                        <Trash2 className="h-4 w-4" style={{ color: "var(--error)" }} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandTable;