export type IngredientUnit = "gram" | "kg" | "ml" | "liter" | "pcs";

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;         // stock on hand
  unit: IngredientUnit;
  purchase_price: number;    // price per unit
  created_at: string;
  updated_at: string | null;
}
