import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ingredient } from "../types/ingredient";
import { STORAGE_KEYS } from "../constants/storageKeys";

interface IngredientStoreState {
  ingredients: Ingredient[];
  addIngredient: (data: Omit<Ingredient, "id" | "createdAt" | "updatedAt">) => void;
  updateIngredient: (id: string, patch: Partial<Omit<Ingredient, "id">>) => void;
  deleteIngredient: (id: string) => void;
  clearAll: () => void;
}

export const useIngredientStore = create<IngredientStoreState>()(
  persist(
    (set, get) => ({
      ingredients: [],

      addIngredient: (data) => {
        const now = new Date().toISOString();
        const newIngredient: Ingredient = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          ...data,
        };
        set({ ingredients: [...get().ingredients, newIngredient] });
      },

      updateIngredient: (id, patch) => {
        const now = new Date().toISOString();
        set({
          ingredients: get().ingredients.map((ing) =>
            ing.id === id ? { ...ing, ...patch, updatedAt: now } : ing
          ),
        });
      },

      deleteIngredient: (id) => {
        set({ ingredients: get().ingredients.filter((ing) => ing.id !== id) });
      },

      clearAll: () => set({ ingredients: [] }),
    }),
    {
      name: STORAGE_KEYS.ingredients,
    }
  )
);
