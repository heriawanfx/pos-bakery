import type { ReactNode } from "react";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Wrapper supaya ada margin di atas/bawah dan kiri/kanan */}
      <div className="w-full max-w-3xl mx-4 my-6">
        <div className="flex max-h-[90vh] flex-col rounded-2xl bg-card border border-border shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              {title}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </Button>
          </div>

          {/* Body scrollable */}
          <div className="px-5 py-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
