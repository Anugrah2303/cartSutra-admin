import type { LucideIcon } from "lucide-react";

export type SummaryStatColor = "purple" | "blue" | "teal" | "amber" | "red" | "green" | "gray" | "indigo";

interface SummaryStatCardProps {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  color?: SummaryStatColor;
  subtext?: string;
}

const COLOR_MAP: Record<SummaryStatColor, { bg: string; icon: string }> = {
  purple: { bg: "linear-gradient(135deg, #7C3AED, #A78BFA)", icon: "#7C3AED" },
  blue: { bg: "linear-gradient(135deg, #2563EB, #60A5FA)", icon: "#2563EB" },
  indigo: { bg: "linear-gradient(135deg, #4F46E5, #818CF8)", icon: "#4F46E5" },
  teal: { bg: "linear-gradient(135deg, #0F766E, #2DD4BF)", icon: "#0F766E" },
  amber: { bg: "linear-gradient(135deg, #D97706, #FBBF24)", icon: "#D97706" },
  red: { bg: "linear-gradient(135deg, #DC2626, #F87171)", icon: "#DC2626" },
  green: { bg: "var(--gradient-primary)", icon: "var(--color-primary)" },
  gray: { bg: "linear-gradient(135deg, #4B5563, #9CA3AF)", icon: "#4B5563" },
};

const SummaryStatCard = ({ label, value, Icon, color = "blue", subtext }: SummaryStatCardProps) => {
  const palette = COLOR_MAP[color];

  return (
    <div
      className="min-w-0 rounded-2xl border p-4 sm:p-5"
      style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm truncate" style={{ color: "var(--text-muted)" }}>{label}</p>
          <p className="mt-2 text-xl sm:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
        </div>
        <div
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0"
          style={{ background: palette.bg }}
        >
          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
        </div>
      </div>

      {subtext && (
        <p className="mt-3 text-xs truncate" style={{ color: "var(--text-muted)" }}>{subtext}</p>
      )}
    </div>
  );
};

export default SummaryStatCard;