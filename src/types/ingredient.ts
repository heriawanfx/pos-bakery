export type IngredientUnit = "gram" | "kg" | "ml" | "liter" | "pcs";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;         // stock on hand
  unit: IngredientUnit;
  purchasePrice: number;    // price per unit
  createdAt: string;
  updatedAt: string;
}
