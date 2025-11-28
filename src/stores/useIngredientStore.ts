import { create } from "zustand";
import type { Ingredient } from "../types/ingredient";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";
import { Result } from "../utils/result";
import { supabase } from "../utils/supabase";

interface IngredientStoreState {
	loading: boolean;
	error: string | null;
	fetch: () => Promise<void>;
	
  ingredients: Ingredient[];
  addIngredient: (data: Omit<Ingredient, "id"|"created_at"|"updated_at">) => Promise<Result<Ingredient>>;
  updateIngredient: (id: number, patch: Partial<Omit<Ingredient, "id"|"created_at"|"updated_at">>) => Promise<Result<Ingredient>>;
  deleteIngredient: (id: number) => Promise<Result<Boolean>>;
}

export const useIngredientStore = create<IngredientStoreState>()(
  //persist(
    (set, get) => ({
			loading: false,
			error: null,
      ingredients: [],

			fetch: async () => {

        const {data, error} = await supabase.from('ingredients')
				.select("id, name, quantity, purchase_price, unit, created_at, updated_at")
        .order("created_at");

				if (error) {
						set({ error: error.message });
						return;
				}

        set({ loading: false, ingredients: data });
      },

      addIngredient: async (input) => {

        const {data: newIngredient, error} = await supabase.from('ingredients')
				.insert(input)
				.select("id, name, quantity, purchase_price, unit, created_at, updated_at")
				.single();

				if (error) {
						set({ error: error.message });
						return Result.error(error.message);
				}
				
        set({ ingredients: [...get().ingredients, newIngredient] });

				return Result.success(newIngredient);
      },

      updateIngredient: async (id, patch) => {

				const {data: updated, error} = await supabase.from('ingredients')
				.update(patch)
				.eq("id", id)
				.select("id, name, quantity, purchase_price, unit, created_at, updated_at")
				//.select("*")
				.single();

				if (error) {
						set({ error: error.message });
						return Result.error(error.message);
				}

        set({
          ingredients: get().ingredients.map((ing) =>
            ing.id === id ? updated : ing
          ),
        });

				return Result.success(updated);
      },

      deleteIngredient: async (id) => {

				const { error} = await supabase.from('ingredients')
				.delete()
				.eq("id", id);

				if (error) {
						set({ error: error.message });
						return Result.error(error.message);
				}

        set({ ingredients: get().ingredients.filter((ing) => ing.id !== id) });
				
				return Result.success(true);
      },

    }),
  //  {
  //    name: STORAGE_KEYS.ingredients,
  //  }
  //)
);

setupZustandStorageSync(STORAGE_KEYS.ingredients, useIngredientStore);