import { useState, type FormEvent } from "react";
import type { Ingredient, IngredientUnit } from "../../types/ingredient";
import { INGREDIENT_UNITS } from "../../constants/options";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { CurrencyInput } from "../ui/CurrencyInput";

export interface IngredientFormValues {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  purchase_price: number;
}

interface IngredientFormProps {
  initialValue?: Ingredient;
  onSubmit: (values: IngredientFormValues) => void;
  onCancel?: () => void;
}

export function IngredientForm({ initialValue, onSubmit, onCancel }: IngredientFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [quantity, setQuantity] = useState<number>(initialValue?.quantity ?? 0);
  const [unit, setUnit] = useState<IngredientUnit>(
    initialValue?.unit ?? INGREDIENT_UNITS[0]
  );
  const [purchase_price, setPurchasePrice] = useState<number>(
    initialValue?.purchase_price ?? 0
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      quantity: Number(quantity) || 0,
      unit,
      purchase_price: Number(purchase_price) || 0,
    });
  };

  const isEditMode = Boolean(initialValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Ingredient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Sugar"
        required
      />

      <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
        <Input
          label="Stock quantity"
          type="number"
          min={0}
          step="0.01"
          value={quantity === 0 ? "" : quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
          placeholder="e.g. 1000"
        />
        <Select
          label="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as IngredientUnit)}
        >
          {INGREDIENT_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
      </div>

      <CurrencyInput
  label="Purchase price per unit"
  value={purchase_price}
  onChange={(v) => setPurchasePrice(v)}
  hint="Example: Rp 23.000"
  placeholder="Rp 0"
/>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditMode ? "Save changes" : "Add ingredient"}
        </Button>
      </div>
    </form>
  );
}
