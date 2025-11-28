import { create } from "zustand";
//import { persist } from "zustand/middleware";
import type { Category } from "../types/category";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";
import { supabase } from "../utils/supabase";
import { Result } from "../utils/result";

interface CategoryStoreState {
    categories: Category[];
    loading: boolean;
    error: string | null;

    /*
    addCategory: (name: string) => void;
    updateCategory: (id: string, patch: Partial<Omit<Category, "id">>) => void;
    deleteCategory: (id: string) => void;
    */
    
    fetchCategories: () => Promise<void>;
    addCategory: (input: Omit<Category, "id"|"created_at"|"updated_at">) => Promise<Result<Category>>;
    updateCategory: (id: number, patch: Partial<Omit<Category, "id"|"created_at"|"updated_at">>) => Promise<Result<Category>>;
    deleteCategory: (id: number) => Promise<Result<Boolean>>;
}


export const useCategoryStore = create<CategoryStoreState>()(
    //persist(
        (set) => ({
            categories: [],
            loading: false,
            error: null,

            fetchCategories: async () => {
                set({ loading: true, error: null });

                const { data, error } = await supabase
                    .from("categories")
                    .select("id, name, description, created_at, updated_at")
                    .order("created_at", { ascending: true });

                if (error) {
                    console.error("Error fetching categories:", error);
                    set({ error: error.message, loading: false });
                    return;
                }

                const mapped: Category[] =
                    data?.map((row: any) => ({
                        id: row.id,
                        name: row.name,
                        description: row.description ?? null,
                        created_at: row.created_at,
                        updated_at: row.created_at
                    })) ?? [];

                set({ categories: mapped, loading: false });
            },


            addCategory: async (input) => {
                console.log('addCategory', input);

                set({ error: null });

                const { data, error } = await supabase
                    .from("categories")
                    .insert({
                        name: input.name,
                        description: input.description ?? null,
                    })
                    .select("id, name, description, created_at, updated_at")
                    .single();

                if (error) {
                    console.error("Error creating category:", error);
                    set({ error: error.message });
                    return Result.error(error.message);
                }

                const newCategory: Category = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };

                set((state) => ({
                    categories: [...state.categories, newCategory],
                }));

                return Result.success(newCategory);
            },

            updateCategory: async (id, patch) => {
                console.log('updateCategory', patch);

                set({ error: null });

                const { data, error } = await supabase
                    .from("categories")
                    .update({
                        name: patch.name,
                        description: patch.description,
                    })
                    .eq("id", id)
                    .select("id, name, description, created_at, updated_at")
                    .single();

                if (error) {
                    console.error("Error updating category:", error);
                    set({ error: error.message });
                    return Result.error(error.message);
                }

                const updated: Category = {
                    id: data.id,
                    name: data.name,
                    description: data.description ?? null,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };

                set((state) => ({
                    categories: state.categories.map((cat) =>
                        cat.id === id ? updated : cat
                    ),
                }));

                return Result.success(updated);
            },

            deleteCategory: async (id) => {
                console.log('deleteCategory', id);

                set({ error: null });

                const { error } = await supabase
                    .from("categories")
                    .delete()
                    .eq("id", id);

                if (error) {
                    console.error("Error deleting category:", error);
                    set({ error: error.message });
                    return Result.error(error.message);
                }

                set((state) => ({
                    categories: state.categories.filter((cat) => cat.id !== id),
                }));

                return Result.success(true);
            },
        }),
    //    { name: STORAGE_KEYS.categories, }
    //)
);

setupZustandStorageSync(STORAGE_KEYS.categories, useCategoryStore);