import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, ...rest }: InputProps) {
  const inputClasses = clsx(
    "w-full rounded-lg border bg-background px-3 py-2 text-sm",
    "border-input focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none",
    error && "border-destructive focus:border-destructive focus:ring-destructive/40",
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input className={inputClasses} {...rest} />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
