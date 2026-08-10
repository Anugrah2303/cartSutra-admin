import type { ReactNode } from "react";

const Card = ({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) => (
    <div className="min-w-0 rounded-2xl border p-5" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }} >
        {title ? (
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {title}
                </h3>
                {action}
            </div>
        ) : null}
        {children}
    </div>
);

export default Card