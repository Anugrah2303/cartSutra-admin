import { RotateCcw, Trash } from "lucide-react";

interface RestorePermanentActionsProps {
  onRestore: () => void;
  onPermanentDelete: () => void;
}

const RestorePermanentActions = ({ onRestore, onPermanentDelete }: RestorePermanentActionsProps) => (
  <div className="flex justify-end gap-1.5">
    <button onClick={onRestore} title="Restore" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
      <RotateCcw className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
    </button>
    <button onClick={onPermanentDelete} title="Delete permanently" className="rounded-md p-2 hover:bg-(--sidebar-item-hover) cursor-pointer">
      <Trash className="h-4 w-4" style={{ color: "var(--error)" }} />
    </button>
  </div>
);

export default RestorePermanentActions;