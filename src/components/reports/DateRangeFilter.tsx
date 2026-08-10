import { X } from "lucide-react";
import type { DateRangeParams } from "../../hooks/queries/analytics.queries";

interface DateRangeFilterProps {
  range: DateRangeParams;
  onChange: (range: DateRangeParams) => void;
}

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

const DateRangeFilter = ({ range, onChange }: DateRangeFilterProps) => {
  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    onChange({ startDate: toISODate(start), endDate: toISODate(end) });
  };

  const hasCustomRange = !!range.startDate || !!range.endDate;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {PRESETS.map((preset) => (
        <button
          key={preset.days}
          onClick={() => applyPreset(preset.days)}
          className="rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer"
          style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}
        >
          {preset.label}
        </button>
      ))}

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={range.startDate ?? ""}
          onChange={(e) => onChange({ ...range, startDate: e.target.value })}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}
        />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>to</span>
        <input
          type="date"
          value={range.endDate ?? ""}
          onChange={(e) => onChange({ ...range, endDate: e.target.value })}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-light)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}
        />
      </div>

      {hasCustomRange && (
        <button onClick={() => onChange({})} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--error)" }}>
          <X className="h-3.5 w-3.5" />
          Reset (last 30 days)
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;