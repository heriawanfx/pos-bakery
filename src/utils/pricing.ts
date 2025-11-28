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
    const ing = ingredientMap.get(usage.ingredient_id);
    if (!ing) return sum;
    if (ing.quantity <= 0) return sum; // hindari bagi 0

    const cost = (usage.usage_qty / ing.quantity) * ing.purchase_price;
    return sum + cost;
  }, 0);

  return Math.round(total); // dibulatkan ke rupiah
}

/** Hitung margin (%) dari HPP & harga jual */
export function calculateMarginPercentage(cost_of_goods: number, selling_price: number): number {
  if (cost_of_goods <= 0 || selling_price <= 0) return 0;
  const profit = selling_price - cost_of_goods;
  const ratio = profit / cost_of_goods;
  return Math.round(ratio * 1000) / 10; // 1 decimal, misal 35.7
}

export function calculateOrderTotal(
  items: OrderItem[],
  products: Product[]
): number {
  if (!items.length) return 0;

  const productMap = new Map(products.map((p) => [p.id, p]));

  const total = items.reduce((sum, item) => {
    const prod = productMap.get(item.product_id);
    if (!prod) return sum;
    const line = item.quantity * prod.selling_price;
    return sum + line;
  }, 0);

  return Math.round(total);
}