export interface ProductIngredientUsage {
  ingredientId: string;
  quantity: number; // usage per product unit
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;

  ingredients: ProductIngredientUsage[];

  costOfGoods: number;      // HPP (auto calculated later)
  sellingPrice: number;
  marginPercentage: number; // (profit / HPP * 100)

  createdAt: string;
  updatedAt: string;
}
