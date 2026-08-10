const DetailRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between py-2 text-sm">
    <span style={{ color: "var(--text-muted)" }}>{label}</span>
    <span style={{ color: "var(--text-primary)" }}>{value || "—"}</span>
  </div>
);

export default DetailRow;