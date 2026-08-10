import { format } from "date-fns";
import { Eye, Truck } from "lucide-react";
import type { ShipmentIF } from "../../interface/data/shipment";
import ShipmentStatusBadge from "./ShipmentStatusBadge";

interface ShipmentTableProps {
  shipments: ShipmentIF[];
  onView: (shipment: ShipmentIF) => void;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--bg-soft)" }}>
      <Truck className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
    </div>
    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No shipments found</p>
    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Try adjusting your filters.</p>
  </div>
);

const ShipmentTable = ({ shipments, onView }: ShipmentTableProps) => {
  if (shipments.length === 0) return <EmptyState />;

  return (
    <>
      {/* ── Desktop / tablet: table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Shipment</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Order</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Items</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Carrier</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Status</th>
              <th className="pb-3 font-medium" style={{ color: "var(--text-muted)" }}>Est. delivery</th>
              <th className="pb-3 font-medium text-right" style={{ color: "var(--text-muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td className="py-3">
                  <button onClick={() => onView(shipment)} className="font-medium hover:underline cursor-pointer" style={{ color: "var(--text-primary)" }}>
                    #{shipment.shipmentNumber}
                  </button>
                  {shipment.trackingNumber && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Trk: {shipment.trackingNumber}</p>
                  )}
                </td>

                <td className="py-3" style={{ color: "var(--text-secondary)" }}>#{shipment.orderNumber}</td>

                <td className="py-3">
                  <div className="flex items-center -space-x-2">
                    {shipment.items.slice(0, 3).map((item, idx) => (
                      <img key={`${item.product}-${idx}`} src={item.thumbnail} alt={item.title} title={item.title} className="h-8 w-8 rounded-md border-2 object-cover" style={{ borderColor: "var(--bg-card)" }} />
                    ))}
                    {shipment.items.length > 3 && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-[10px] font-medium" style={{ borderColor: "var(--bg-card)", backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
                        +{shipment.items.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3" style={{ color: "var(--text-primary)" }}>{shipment.carrier.replace(/_/g, " ")}</td>

                <td className="py-3"><ShipmentStatusBadge status={shipment.status} /></td>

                <td className="py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), "MMM d, yyyy") : "—"}
                </td>

                <td className="py-3">
                  <div className="flex justify-end">
                    <button onClick={() => onView(shipment)} className="rounded-md p-2 hover:bg-(--bg-soft) cursor-pointer" title="View shipment">
                      <Eye className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: cards ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {shipments.map((shipment) => (
          <button key={shipment._id} onClick={() => onView(shipment)} className="text-left rounded-xl border p-4 cursor-pointer active:scale-[0.99] transition-transform" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>#{shipment.shipmentNumber}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Order #{shipment.orderNumber}</p>
              </div>
              <ShipmentStatusBadge status={shipment.status} />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center -space-x-2">
                {shipment.items.slice(0, 4).map((item, idx) => (
                  <img key={`${item.product}-${idx}`} src={item.thumbnail} alt={item.title} className="h-8 w-8 rounded-md border-2 object-cover" style={{ borderColor: "var(--bg-card)" }} />
                ))}
                {shipment.items.length > 4 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-[10px] font-medium" style={{ borderColor: "var(--bg-card)", backgroundColor: "var(--bg-soft)", color: "var(--text-secondary)" }}>
                    +{shipment.items.length - 4}
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{shipment.carrier.replace(/_/g, " ")}</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {shipment.trackingNumber ? `Trk: ${shipment.trackingNumber}` : "No tracking yet"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), "MMM d") : "—"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default ShipmentTable;