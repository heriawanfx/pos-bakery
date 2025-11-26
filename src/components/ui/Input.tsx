import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  success?: string;
}

export function Input({
  label,
  hint,
  leftIcon,
  rightIcon,
  error,
  success,
  className,
  ...props
}: InputProps) {
  const hasError = !!error;
  const hasSuccess = !!success && !error; // error menang jika dua-duanya ada

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        className={clsx(
          "flex items-center gap-2 rounded-xl border bg-background px-3 py-2",
          "focus-within:ring-2",
          // Normal
          !hasError && !hasSuccess && "border-input focus-within:ring-primary/40",
          // Error state
          hasError &&
            "border-red-500 focus-within:ring-red-500/40 text-red-600",
          // Success state
          hasSuccess &&
            "border-emerald-500 focus-within:ring-emerald-500/40 text-emerald-700",
          className
        )}
      >
        {leftIcon && (
          <span className="flex items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          className={clsx(
            "flex-1 bg-transparent outline-none border-none text-sm",
            leftIcon && "pl-1",
            rightIcon && "pr-1",
            hasError && "text-red-600 placeholder-red-400",
            hasSuccess && "text-emerald-700 placeholder-emerald-400"
          )}
        />

        {rightIcon && (
          <span className="flex items-center text-muted-foreground">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Error text */}
      {hasError && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Success text */}
      {hasSuccess && (
        <p className="text-xs text-emerald-600">{success}</p>
      )}

      {/* Normal hint */}
      {!hasError && !hasSuccess && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
