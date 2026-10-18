import React, { useEffect } from "react";
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react";

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconBox: "bg-red-50 text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  primary: {
    icon: HelpCircle,
    iconBox: "bg-teal-50 text-teal-700",
    button: "bg-teal-700 hover:bg-teal-600",
  },
};


const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  icon,
  onConfirm,
  onCancel,
}) => {

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const styles = VARIANTS[variant] ?? VARIANTS.danger;
  const Icon = icon ?? styles.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={() => !loading && onCancel?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBox}`}
        >
          <Icon size={22} />
        </span>

        <h3
          id="confirm-modal-title"
          className="mt-4 text-lg font-semibold text-slate-900"
        >
          {title}
        </h3>

        {message && <div className="mt-2 text-sm text-slate-500">{message}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 ${styles.button}`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;