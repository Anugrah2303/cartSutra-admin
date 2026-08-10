import { ProductLifecycleStatus } from "../../enums/product.enum";

const STATUS_STYLES: Record<string, string> = {
  [ProductLifecycleStatus.ACTIVE]: "bg-green-100 text-green-700",
  [ProductLifecycleStatus.DRAFT]: "bg-gray-100 text-gray-600",
  [ProductLifecycleStatus.OUT_OF_STOCK]: "bg-amber-100 text-amber-700",
  [ProductLifecycleStatus.ARCHIVED]: "bg-red-100 text-red-700",
};

const Badge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
    {status.replace("_", " ")}
  </span>
);

export default Badge;