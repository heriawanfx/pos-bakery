import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductIngredientUsage } from "../types/product";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

export interface ProductInput {
  name: string;
  category_id: number;
  ingredients: ProductIngredientUsage[];
  selling_price: number;
  cost_of_goods: number;
  margin_percentage: number;
}

interface ProductStoreState {
  products: Product[];
  addProduct: (data: ProductInput) => void;
  updateProduct: (id: number, patch: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: number) => void;
  clearAll: () => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (data) => {
        const now = new Date().toISOString();
        const newProduct: Product = {
          id: -1,
          created_at: now,
          updated_at: now,
          ...data,
        };

        set({ products: [...get().products, newProduct] });
      },

      updateProduct: (id, patch) => {
        const now = new Date().toISOString();
        set({
          products: get().products.map((prod) =>
            prod.id === id ? { ...prod, ...patch, updated_at: now } : prod
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

setupZustandStorageSync(STORAGE_KEYS.products, useProductStore);
