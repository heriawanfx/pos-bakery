export interface ProductIngredientUsage {
  product_id: number;
  ingredient_id: number;
  usage_qty: number; // usage per product unit
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  selling_price: number;
  cost_of_goods: number;      // HPP (auto calculated later)
  created_at: string;
  updated_at: string;

  margin_percentage: number; // (profit / HPP * 100)
  ingredients: ProductIngredientUsage[];
}
