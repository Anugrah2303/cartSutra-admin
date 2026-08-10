import { Warehouse as WarehouseIcon, Star } from "lucide-react";
import StatusToggle from "../common/StatusToggle";
import type { WarehouseIF } from "../../interface/data/warehouse";

interface WarehouseTableProps {
  warehouses: WarehouseIF[];
  onToggle: (warehouse: WarehouseIF) => void;
}

const WarehouseTable = ({ warehouses, onToggle }: WarehouseTableProps) => {
  if (warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <WarehouseIcon className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No warehouses found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Warehouse</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Location</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Contact</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Capacity</th>
            <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
              <td className="py-3">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "var(--text-primary)" }}>{warehouse.name}</span>
                  {warehouse.isDefault && <Star className="h-3.5 w-3.5 fill-current" style={{ color: "var(--warning)" }} />}
                </div>
                <code className="text-xs" style={{ color: "var(--text-muted)" }}>{warehouse.code}</code>
              </td>
              <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                {warehouse.address.city}, {warehouse.address.state}
              </td>
              <td className="py-3">
                <p style={{ color: "var(--text-primary)" }}>{warehouse.contactPerson}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{warehouse.contactPhone}</p>
              </td>
              <td className="py-3" style={{ color: "var(--text-secondary)" }}>{warehouse.totalCapacity ?? "—"}</td>
              <td className="py-3">
                <StatusToggle isActive={warehouse.isActive} onToggle={() => onToggle(warehouse)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseTable;