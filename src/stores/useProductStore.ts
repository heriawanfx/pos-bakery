import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductIngredientUsage } from "../types/product";
import { STORAGE_KEYS } from "../constants/storageKeys";

export interface ProductInput {
  name: string;
  categoryId: string;
  ingredients: ProductIngredientUsage[];
  sellingPrice: number;
}

interface ProductStoreState {
  products: Product[];
  addProduct: (data: ProductInput) => void;
  updateProduct: (id: string, patch: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
  clearAll: () => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (data) => {
        const now = new Date().toISOString();

        // HPP & margin akan dihitung beneran nanti pakai utils/pricing
        const costOfGoods = 0;
        const marginPercentage = 0;

        const newProduct: Product = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          costOfGoods,
          marginPercentage,
          ...data,
        };

        set({ products: [...get().products, newProduct] });
      },

      updateProduct: (id, patch) => {
        const now = new Date().toISOString();
        set({
          products: get().products.map((prod) =>
            prod.id === id ? { ...prod, ...patch, updatedAt: now } : prod
          ),
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((prod) => prod.id !== id),
        });
      },

      clearAll: () => set({ products: [] }),
    }),
    {
      name: STORAGE_KEYS.products,
    }
  )
);
