import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
import { useProductIngredientsStore } from '../../stores/useProductIngredientsStore';
import { useToast } from '../ui/ToastProvider';
import type { Result } from '../../utils/result';

export interface ProductFormValues {
  name: string;
  category_id: number;
  //product_id: number;
  selling_price: number;
  cost_of_goods: number;

  //margin_percentage: number;
  //ingredients: ProductIngredientUsage[];
}

interface ProductFormProps {
  initialValue?: Product;
  onSubmit: (values: ProductFormValues) => Promise<Result<Product | null>>;
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
  const [category_id, setCategoryId] = useState(() => {
    if (initialValue) return initialValue.category_id;
    return categories[0]?.id ?? -1;
  });
  const [selling_price, setSellingPrice] = useState<number>(
    initialValue?.selling_price ?? 0
  );
  const [usageRows, setUsageRows] = useState<ProductIngredientUsage[]>(
    initialValue?.ingredients ?? []
  );

  const hasIngredients = ingredients.length > 0;

  // hitung HPP dan margin secara realtime
  const cost_of_goods = useMemo(
    () => calculateCostOfGoods(usageRows, ingredients),
    [usageRows, ingredients]
  );
  const margin_percentage = useMemo(
    () => calculateMarginPercentage(cost_of_goods, selling_price),
    [cost_of_goods, selling_price]
  );

  /*
  useEffect(() => {
    // jika categories baru dibuat dan tidak ada category_id, pilih yang pertama
    if (!category_id && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, category_id]);
  */

  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const resProduct = await onSubmit({
      name: name.trim(),
      category_id,
      //product_id: initialValue?.id ?? -1,
      selling_price,
      cost_of_goods,
      //margin_percentage,
      //ingredients: usageRows.filter((u) => u.ingredient_id && u.usage_qty > 0),
    });

    if (!resProduct.success) {
      showToast({
        variant: 'error',
        description: resProduct.error,
        title: 'Ada Masalah',
      });
      return;
    }

    const usagesInput = usageRows.filter(
      (u) => u.ingredient_id && u.usage_qty > 0
    );

    const resUsage = await saveForProduct(initialValue?.id ?? -1, usagesInput);

    if (!resUsage.success) {
      showToast({
        variant: 'error',
        description: resUsage.error,
        title: 'Ada Masalah',
      });
      return;
    }

    showToast({
      description: 'Produk dan bahan berhasil disimpan',
    });
  };

  const handleAddRow = () => {
    setUsageRows((rows) => [
      ...rows,
      {
        ingredient_id: ingredients[0]?.id ?? -1,
        usage_qty: 0,
        product_id: initialValue?.id ?? -1,
        created_at: new Date().toISOString(),
      },
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
    !!category_id &&
    selling_price > 0 &&
    usageRows.some((u) => u.ingredient_id && u.usage_qty > 0);

  const { byProductId, fetchByProduct, saveForProduct, loading } =
    useProductIngredientsStore();
  useEffect(() => {
    if (isEditMode) {
      void fetchByProduct(initialValue?.id ?? -1);
      console.info(`[useEffect] fetchByProduct(${initialValue?.id})`)
    }
  }, [isEditMode, fetchByProduct]);

  useEffect(() => {
    const usages = byProductId[initialValue?.id ?? -1];
    if (!usages) return;

    
    console.info(`[useEffect] byProductId(${initialValue?.id})`)
    console.info(`[useEffect] usages`, usages)
    setUsageRows(
      usages.map((u) => ({
        ingredient_id: u.ingredient_id,
        usage_qty: u.usage_qty,
        product_id: initialValue?.id ?? -1,
        created_at: new Date().toISOString(),
      }))
    );
  }, [initialValue?.id, byProductId]);

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
          value={category_id}
          onChange={(e) => setCategoryId(Number.parseInt(e.target.value))}
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
        ) : loading ? (
        <div className="text-sm text-muted-foreground">
        Loading...
        </div>
    ) : (
          <div className="space-y-3">
            {usageRows.map((row, index) => {
              const ing = ingredients.find((i) => i.id === row.ingredient_id);
              const remainingStock = ing
                ? Math.max(ing.quantity - row.usage_qty, 0)
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
                    value={row.ingredient_id}
                    onChange={(e) =>
                      handleUpdateRow(index, {
                        ingredient_id: Number.parseInt(e.target.value),
                      })
                    }
                  >
                    {ingredients.map((ingOption) => (
                      <option key={ingOption.id} value={ingOption.id}>
                        {ingOption.name} (Rp{' '}
                        {ingOption.purchase_price.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </Select>

                  {/* Qty used */}
                  <Input
                    label={showLabels ? 'Qty used' : undefined}
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.usage_qty === 0 ? '' : row.usage_qty}
                    onChange={(e) =>
                      handleUpdateRow(index, {
                        usage_qty: Number(e.target.value) || 0,
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
            value={selling_price}
            onChange={(v) => setSellingPrice(v)}
            hint="Final price to customer"
          />

          <div>
            <label className="block text-sm font-medium text-foreground">
              Cost of goods (HPP)
            </label>
            <div className="mt-1 text-sm">
              {cost_of_goods > 0 ? (
                <span>Rp {cost_of_goods.toLocaleString('id-ID')}</span>
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
              {margin_percentage > 0 ? (
                <span>{margin_percentage.toFixed(1)}%</span>
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
