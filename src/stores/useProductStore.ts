import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductIngredientUsage } from "../types/product";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

export interface ProductInput {
  name: string;
  categoryId: string;
  ingredients: ProductIngredientUsage[];
  sellingPrice: number;
  costOfGoods: number;
  marginPercentage: number;
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
        const newProduct: Product = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
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

setupZustandStorageSync(STORAGE_KEYS.products, useProductStore);
