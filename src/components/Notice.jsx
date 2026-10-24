import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function Notice({ message, type = "success", onClose }) {
  if (!message) return null;
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={`notice notice-${type}`} role="status">
      <Icon size={18} />
      <span>{String(message)}</span>
      {onClose && <button aria-label="Dismiss message" onClick={onClose}><X size={16} /></button>}
    </div>
  );
}