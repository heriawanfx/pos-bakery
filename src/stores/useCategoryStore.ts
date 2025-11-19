import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "../types/category";
import { STORAGE_KEYS } from "../constants/storageKeys";

interface CategoryStoreState {
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, patch: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;
  clearAll: () => void;
}

export const useCategoryStore = create<CategoryStoreState>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (name) => {
        const now = new Date().toISOString();
        const newCategory: Category = {
          id: crypto.randomUUID(),
          name,
          createdAt: now,
          updatedAt: now,
        };
        set({ categories: [...get().categories, newCategory] });
      },

      updateCategory: (id, patch) => {
        const now = new Date().toISOString();
        set({
          categories: get().categories.map((cat) =>
            cat.id === id ? { ...cat, ...patch, updatedAt: now } : cat
          ),
        });
      },

      deleteCategory: (id) => {
        set({
          categories: get().categories.filter((cat) => cat.id !== id),
        });
      },

      clearAll: () => set({ categories: [] }),
    }),
    {
      name: STORAGE_KEYS.categories,
    }
  )
);
