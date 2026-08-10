import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string; // tailwind max-width class, e.g. "max-w-lg"
}

const Modal = ({ open, title, onClose, children, maxWidth = "max-w-lg" }: ModalProps) => {
  if (!open) return null; // don't render anything when closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl p-6`}
        style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside the box
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-(--sidebar-item-hover) cursor-pointer">
            <X className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;