import type { Product, ProductIngredientUsage } from "../types/product";
import type { Ingredient } from "../types/ingredient";
import type { OrderItem } from "../types/order";

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
    if (ing.quantity <= 0) return sum; // hindari bagi 0

    const cost = (usage.quantity / ing.quantity) * ing.purchasePrice;
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

export function calculateOrderTotal(
  items: OrderItem[],
  products: Product[]
): number {
  if (!items.length) return 0;

  const productMap = new Map(products.map((p) => [p.id, p]));

  const total = items.reduce((sum, item) => {
    const prod = productMap.get(item.productId);
    if (!prod) return sum;
    const line = item.quantity * prod.sellingPrice;
    return sum + line;
  }, 0);

  return Math.round(total);
}