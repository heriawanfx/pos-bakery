import { useState, type FormEvent } from "react";
import type { Category } from "../../types/category";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface CategoryFormProps {
  initialValue?: Category;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
}

export function CategoryForm({ initialValue, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const isEditMode = Boolean(initialValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Dry cookies"
        required
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? "Save changes" : "Add category"}
        </Button>
      </div>
    </form>
  );
}
