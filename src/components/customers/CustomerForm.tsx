import { useState, type FormEvent } from "react";
import type { Customer } from "../../types/customer";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface CustomerFormValues {
  name: string;
  address?: string;
  phone?: string;
}

interface CustomerFormProps {
  initialValue?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel?: () => void;
}

export function CustomerForm({ initialValue, onSubmit, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [address, setAddress] = useState(initialValue?.address ?? "");
  const [phone, setPhone] = useState(initialValue?.phone ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  const isEditMode = Boolean(initialValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Customer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Ibu Ani"
        required
      />

      <Input
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Optional"
      />

      <Input
        label="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 0812 3456 7890"
        hint="WhatsApp or phone number"
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? "Save changes" : "Add customer"}
        </Button>
      </div>
    </form>
  );
}
