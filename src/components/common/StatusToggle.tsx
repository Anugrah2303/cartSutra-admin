// src/components/common/StatusToggle.tsx
import { ToggleLeft, ToggleRight } from "lucide-react";

interface StatusToggleProps {
  isActive: boolean;
  onToggle: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
}

const StatusToggle = ({
  isActive,
  onToggle,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  disabled = false,
}: StatusToggleProps) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className="flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isActive ? (
      <ToggleRight className="h-5 w-5" style={{ color: "var(--success)" }} />
    ) : (
      <ToggleLeft className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
    )}
    <span className="text-xs font-medium" style={{ color: isActive ? "var(--success)" : "var(--text-muted)" }}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  </button>
);

export default StatusToggle;