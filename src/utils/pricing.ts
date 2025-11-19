import type { ProductIngredientUsage } from "../types/product";
import type { Ingredient } from "../types/ingredient";

/** Hitung HPP produk berdasarkan list penggunaan bahan */
export function calculateCostOfGoods(
  usages: ProductIngredientUsage[],
  ingredients: Ingredient[]
): number {
  if (!usages.length) return 0;

  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  const total = usages.reduce((sum, usage) => {
    const ing = ingredientMap.get(usage.ingredientId);
    if (!ing) return sum;
    const cost = usage.quantity * ing.purchasePrice;
    return sum + cost;
  }, 0);

  return Math.round(total); // dibulatkan ke rupiah
}

/** Hitung margin (%) dari HPP & harga jual */
export function calculateMarginPercentage(costOfGoods: number, sellingPrice: number): number {
  if (costOfGoods <= 0 || sellingPrice <= 0) return 0;
  const profit = sellingPrice - costOfGoods;
  const ratio = profit / costOfGoods;
  return Math.round(ratio * 1000) / 10; // 1 decimal, misal 35.7
}
