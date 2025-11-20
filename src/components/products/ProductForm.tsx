import { useMemo, useState, type FormEvent } from 'react';
import type { Product, ProductIngredientUsage } from '../../types/product';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useIngredientStore } from '../../stores/useIngredientStore';
import {
  calculateCostOfGoods,
  calculateMarginPercentage,
} from '../../utils/pricing';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export interface ProductFormValues {
  name: string;
  categoryId: string;
  ingredients: ProductIngredientUsage[];
  sellingPrice: number;
  costOfGoods: number;
  marginPercentage: number;
}

interface ProductFormProps {
  initialValue?: Product;
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void;
}

export function ProductForm({
  initialValue,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { categories } = useCategoryStore();
  const { ingredients } = useIngredientStore();

  const [name, setName] = useState(initialValue?.name ?? '');
  const [categoryId, setCategoryId] = useState(() => {
    if (initialValue) return initialValue.categoryId;
    return categories[0]?.id ?? '';
  });
  const [sellingPrice, setSellingPrice] = useState<number>(
    initialValue?.sellingPrice ?? 0
  );
  const [usageRows, setUsageRows] = useState<ProductIngredientUsage[]>(
    initialValue?.ingredients ?? []
  );

  const hasIngredients = ingredients.length > 0;

  // hitung HPP dan margin secara realtime
  const costOfGoods = useMemo(
    () => calculateCostOfGoods(usageRows, ingredients),
    [usageRows, ingredients]
  );
  const marginPercentage = useMemo(
    () => calculateMarginPercentage(costOfGoods, sellingPrice),
    [costOfGoods, sellingPrice]
  );

  /*
  useEffect(() => {
    // jika categories baru dibuat dan tidak ada categoryId, pilih yang pertama
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);
  */

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      categoryId,
      ingredients: usageRows.filter((u) => u.ingredientId && u.quantity > 0),
      sellingPrice,
      costOfGoods,
      marginPercentage,
    });
  };

  const handleAddRow = () => {
    setUsageRows((rows) => [
      ...rows,
      { ingredientId: ingredients[0]?.id ?? '', quantity: 0 },
    ]);
  };

  const handleUpdateRow = (
    index: number,
    patch: Partial<ProductIngredientUsage>
  ) => {
    setUsageRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const handleRemoveRow = (index: number) => {
    setUsageRows((rows) => rows.filter((_, i) => i !== index));
  };

  const isEditMode = Boolean(initialValue);
  const canSubmit =
    !!name.trim() &&
    !!categoryId &&
    sellingPrice > 0 &&
    usageRows.some((u) => u.ingredientId && u.quantity > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nastar 250g"
          required
        />

        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Ingredients usage</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddRow}
            disabled={!hasIngredients}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add ingredient
          </Button>
        </div>

        {!hasIngredients ? (
          <p className="text-xs text-muted-foreground">
            No ingredients available yet. Please create ingredients first.
          </p>
        ) : (
          <div className="space-y-3">
            {usageRows.map((row, index) => {
              const ing = ingredients.find((i) => i.id === row.ingredientId);
              const remainingStock = ing
                ? Math.max(ing.quantity - row.quantity, 0)
                : 0;

              const showLabels = index === 0;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-border/60 bg-background/40 px-3 py-3 space-y-3 md:space-y-0 md:grid md:grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr),auto] md:gap-3"
                >
                  {/* Ingredient */}
                  <Select
                    label={showLabels ? 'Ingredient' : undefined}
                    value={row.ingredientId}
                    onChange={(e) =>
                      handleUpdateRow(index, { ingredientId: e.target.value })
                    }
                  >
                    {ingredients.map((ingOption) => (
                      <option key={ingOption.id} value={ingOption.id}>
                        {ingOption.name} (Rp{' '}
                        {ingOption.purchasePrice.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </Select>

                  {/* Qty used */}
                  <Input
                    label={showLabels ? 'Qty used' : undefined}
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.quantity === 0 ? '' : row.quantity}
                    onChange={(e) =>
                      handleUpdateRow(index, {
                        quantity: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 100"
                  />

                  {/* Remaining stock */}
                  <Input
                    label={showLabels ? 'Remaining stock' : undefined}
                    readOnly
                    type="number"
                    value={remainingStock}
                    hint={
                      ing
                        ? `Total stock: ${ing.quantity.toLocaleString(
                            'id-ID'
                          )} ${ing.unit}`
                        : 'No ingredient selected'
                    }
                  />

                  {/* Delete button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted"
                      onClick={() => handleRemoveRow(index)}
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="text-sm font-semibold">Pricing</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <CurrencyInput
            label="Selling price"
            value={sellingPrice}
            onChange={(v) => setSellingPrice(v)}
            hint="Final price to customer"
          />

          <div>
            <label className="block text-sm font-medium text-foreground">
              Cost of goods (HPP)
            </label>
            <div className="mt-1 text-sm">
              {costOfGoods > 0 ? (
                <span>Rp {costOfGoods.toLocaleString('id-ID')}</span>
              ) : (
                <span className="text-muted-foreground">Rp 0</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Margin
            </label>
            <div className="mt-1 text-sm">
              {marginPercentage > 0 ? (
                <span>{marginPercentage.toFixed(1)}%</span>
              ) : (
                <span className="text-muted-foreground">0%</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {isEditMode ? 'Save product' : 'Add product'}
        </Button>
      </div>
    </form>
  );
}
