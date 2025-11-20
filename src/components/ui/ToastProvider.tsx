import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, Info, MailWarning } from "lucide-react";
import clsx from "clsx";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title?: string;
  description?: string ;
  variant?: ToastVariant;
  duration?: number; // ms
}

interface ToastContextValue {
  showToast: (options: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((options: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const duration = options.duration ?? 4000;

    const toast: Toast = {
      id,
      duration,
      title: options.title ?? "Berhasil",
      variant: options.variant ?? "info",
      ...options,
    };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Pilih icon & warna sesuai variant
  const renderIcon = (variant: ToastVariant = "info") => {
    const base = "h-4 w-4";
    switch (variant) {
      case "success":
        return <CheckCircle2 className={clsx(base, "text-emerald-800")} />;
      case "error":
        return <AlertCircle className={clsx(base, "text-red-800")} />;
      case "warning":
        return <MailWarning className={clsx(base, "text-orange-800")} />;
      default:
        return <Info className={clsx(base, "text-blue-800")} />;
    }
  };

   const variantBColor: Record<ToastVariant, string> = {
    success: "bg-emerald-200 text-emerald-800 border-emerald-800",
    error: "bg-red-200 text-red-800 border-red-800",
    info: "bg-blue-200 text-blue-800 border-blue-800",
    warning: "bg-orange-200 text-orange-800 border-orange-800"
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {createPortal(
        <div
          className={clsx(
            "pointer-events-none fixed z-50",
            // Mobile: top center-ish
            "inset-x-4 top-4 flex flex-col gap-2 items-stretch",
            // Desktop (md+): kanan bawah
            "md:inset-x-auto md:top-auto md:bottom-4 md:right-4 md:left-auto md:items-end"
          )}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={clsx(
                "pointer-events-auto w-full max-w-sm rounded-xl border shadow-lg p-3 flex gap-3",
                variantBColor[toast.variant ?? "info"]
              )}
            >
              <div className="mt-1">{renderIcon(toast.variant)}</div>
              <div className="flex-1 text-sm">
                {toast.title && (
                  <div className="font-medium leading-snug">{toast.title}</div>
                )}
                {toast.description && (
                  <div className="mt-0.5 text-xs leading-snug">
                    {toast.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
