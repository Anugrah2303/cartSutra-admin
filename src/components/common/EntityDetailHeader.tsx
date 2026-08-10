import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import Heading2 from "./Headings/Heading2";

interface EntityDetailHeaderProps {
  backLabel: string;
  backTo: string;
  avatarUrl?: string;
  fallbackInitial?: string;
  title: string;
  badge?: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

const EntityDetailHeader = ({ backLabel, backTo, avatarUrl, fallbackInitial = "?", title, badge, subtitle, actions }: EntityDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate(backTo)} className="flex items-center gap-1.5 text-sm cursor-pointer w-fit" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={title} className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl text-xl font-semibold text-white" style={{ background: "var(--gradient-primary)" }}>
              {fallbackInitial.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Heading2 title={title} />
              {badge}
            </div>
            {subtitle && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </>
  );
};

export default EntityDetailHeader;