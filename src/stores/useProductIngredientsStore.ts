import { create } from "zustand";
import { supabase } from "../utils/supabase";
import { Result } from "../utils/result";
import type { ProductIngredientUsage } from "../types/product";

interface ProductIngredientsStoreState {
    byProductId: Record<number, ProductIngredientUsage[]>;
    loading: boolean;
    error: string | null;

    clearError: () => void;

    fetchByProduct: (productId: number) => Promise<Result<ProductIngredientUsage[]>>;

    saveForProduct: (
        productId: number,
        usages: Pick<ProductIngredientUsage, "product_id" | "usage_qty" | "ingredient_id">[]
    ) => Promise<Result<ProductIngredientUsage[]>>;
}

export const useProductIngredientsStore = create<ProductIngredientsStoreState>((set) => ({
    byProductId: {},
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchByProduct: async (productId) => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from("product_ingredients")
            .select("id, product_id, ingredient_id, usage_qty, created_at")
            .eq("product_id", productId)
            .order("id", { ascending: true });

        if (error) {
            console.error("[useProductIngredientsStore] fetchByProduct error:", error);
            set({ loading: false, error: error.message });
            return Result.error(error.message);
        }

        const mapped = (data ?? []).map((row: ProductIngredientUsage) => ({
            product_id: row.product_id,
            ingredient_id: row.ingredient_id,
            usage_qty: row.ingredient_id,
            created_at: row.created_at,
        }));

        set((state) => ({
            byProductId: {
                ...state.byProductId,
                [productId]: mapped,
            },
            loading: false,
        }));

        return Result.success(mapped);
    },

    saveForProduct: async (productId, usages) => {
        set({ error: null, loading: true });

        // 1) hapus semua usage lama untuk product ini
        const { error: deleteError } = await supabase
            .from("product_ingredients")
            .delete()
            .eq("product_id", productId);

        if (deleteError) {
            console.error("[useProductIngredientsStore] delete old usages error:", deleteError);
            set({ loading: false, error: deleteError.message });
            return Result.error(deleteError.message);
        }

        // 2) siapkan data baru
        const rowsToInsert = usages
            .filter((u) => u.usage_qty > 0);

        if (rowsToInsert.length === 0) {
            // Tidak ada pemakaian → anggap kosong
            set((state) => ({
                byProductId: {
                    ...state.byProductId,
                    [productId]: [],
                },
                loading: false,
            }));
            return Result.success([]);
        }

        // 3) insert usages baru
        const { data, error: insertError } = await supabase
            .from("product_ingredients")
            .insert(rowsToInsert)
            .select("id, product_id, ingredient_id, usage_qty, created_at");

        if (insertError) {
            console.error("[useProductIngredientsStore] insert usages error:", insertError);
            set({ loading: false, error: insertError.message });
            return Result.error(insertError.message);
        }

        const mapped = (data ?? []).map((row: ProductIngredientUsage) => ({
            product_id: row.product_id,
            ingredient_id: row.ingredient_id,
            usage_qty: row.ingredient_id,
            created_at: row.created_at,
        }));


        set((state) => ({
            byProductId: {
                ...state.byProductId,
                [productId]: mapped,
            },
            loading: false,
        }));

        return Result.success(mapped);
    },
}));
