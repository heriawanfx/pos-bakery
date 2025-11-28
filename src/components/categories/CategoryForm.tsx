import { useState, type FormEvent } from "react";
import type { Category } from "../../types/category";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface CategoryFormProps {
  initialValue?: Category;
  onSubmit: (name: Category) => void;
  onCancel?: () => void;
}

export function CategoryForm({ initialValue, onSubmit, onCancel }: CategoryFormProps) {
  const [category, setCategory] = useState<Category>(initialValue ?? {
    id: -1,
    name: "",
    description: "",
    created_at: "",
    updated_at: ""
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = category.name.trim();
    if (!trimmed) return;
    onSubmit({...category, name: trimmed});
  };

  const isEditMode = Boolean(initialValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category name"
        value={category.name}
        onChange={(e) => setCategory({...category, name: e.target.value})}
        placeholder="e.g. Dry cookies"
        required
      />
      <Input
        label="Description"
        value={category.description ?? ""}
        onChange={(e) => setCategory({...category, description: e.target.value})}
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
