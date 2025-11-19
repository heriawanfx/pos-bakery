import { useState, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface CurrencyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'type'
  > {
  label?: string;
  value?: number; // nilai angka (misal 23000)
  onChange?: (value: number) => void;
  error?: string;
  hint?: string;
}

export function CurrencyInput({
  label,
  value = 0,
  onChange,
  error,
  hint,
  className,
  ...rest
}: CurrencyInputProps) {
  // tampilkan 23.000, tanpa "Rp"
  const [display, setDisplay] = useState<string>(
    value ? value.toLocaleString('id-ID') : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // simpan semua digit saja
    const digitsOnly = raw.replace(/\D/g, '');
    if (!digitsOnly) {
      setDisplay('');
      onChange?.(0);
      return;
    }

    const numeric = Number(digitsOnly);
    const formatted = numeric.toLocaleString('id-ID');

    setDisplay(formatted);
    onChange?.(numeric);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        className={clsx(
          'relative flex items-center rounded-lg border bg-background px-3 py-2 text-sm',
          'border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40',
          error &&
            'border-destructive focus-within:border-destructive focus-within:ring-destructive/40',
          className
        )}
      >
        {/* Prefix Rp */}
        <span className="absolute left-3 text-sm text-muted-foreground select-none pointer-events-none">
          Rp
        </span>

        {/* Input */}
        <input
          {...rest}
          type="text"
          inputMode="numeric"
          className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none pl-12 pr-2 text-sm"
          value={display}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
