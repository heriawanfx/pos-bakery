import { create } from "zustand";
import { supabase } from "../utils/supabase";
import type { Product } from "../types/product";
import { Result } from "../utils/result";

interface ProductStoreState {
    products: Product[];
    loading: boolean;
    error: string | null;

    fetchProducts: () => Promise<Result<Product[]>>;
    addProduct: (input: Pick<Product, "name" | "category_id" | "selling_price" | "cost_of_goods">) => Promise<Result<Product>>;
    updateProduct: (
        id: number,
        patch: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
    ) => Promise<Result<Product>>;
    deleteProduct: (id: number) => Promise<Result<boolean>>;
}

export const useProductStore = create<ProductStoreState>((set) => ({
    products: [],
    loading: false,
    error: null,

    // GET /products
    fetchProducts: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from("products")
            .select("id, category_id, name, selling_price, cost_of_goods, created_at, updated_at")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("[useProductStore] fetchProducts error:", error);
            set({ loading: false, error: error.message });
            return Result.error(error.message);
        }

        const mapped: Product[] =
            data?.map((row) => ({
                id: row.id,
                category_id: row.category_id,
                name: row.name,
                cost_of_goods: row.cost_of_goods,
                selling_price: row.selling_price,
                created_at: row.created_at,
                updated_at: row.updated_at,
                margin_percentage: row.selling_price > 0 ? (row.selling_price - row.cost_of_goods / row.selling_price) * 100 : 0,
                ingredients: [],

            })) ?? [];

        set({ products: mapped, loading: false });
        return Result.success(mapped);
    },

    // POST /products
    addProduct: async (input) => {
        set({ error: null });

        const { data, error } = await supabase
            .from("products")
            .insert(input)
            .select("id, category_id, name, selling_price, cost_of_goods, created_at, updated_at")
            .single();

        if (error) {
            console.error("[useProductStore] createProduct error:", error);
            set({ error: error.message });
            return Result.error(error.message);
        }

        const mapped = {
            id: data.id,
            category_id: data.category_id,
            name: data.name,
            cost_of_goods: data.cost_of_goods,
            selling_price: data.selling_price,
            created_at: data.created_at,
            updated_at: data.updated_at,
            margin_percentage: data.selling_price > 0 ? (data.selling_price - data.cost_of_goods / data.selling_price) * 100 : 0,
            ingredients: [],

        };

        set((state) => ({
            products: [...state.products, mapped],
        }));

        return Result.success(mapped);
    },

    // PATCH /products/:id
    updateProduct: async (id, patch) => {
        set({ error: null });

        const { data, error } = await supabase
            .from("products")
            .update(patch)
            .eq("id", id)
            .select("id, category_id, name, selling_price, cost_of_goods, created_at, updated_at")
            .single();

        if (error) {
            console.error("[useProductStore] updateProduct error:", error);
            set({ error: error.message });
            return Result.error(error.message);
        }

        const mapped = {
            id: data.id,
            category_id: data.category_id,
            name: data.name,
            cost_of_goods: data.cost_of_goods,
            selling_price: data.selling_price,
            created_at: data.created_at,
            updated_at: data.updated_at,
            margin_percentage: data.selling_price > 0 ? (data.selling_price - data.cost_of_goods / data.selling_price) * 100 : 0,
            ingredients: [],

        };

        set((state) => ({
            products: state.products.map((row) => (row.id === id ? mapped : row)),
        }));

        return Result.success(mapped);
    },

    // DELETE /products/:id
    deleteProduct: async (id) => {
        set({ error: null });

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("[useProductStore] deleteProduct error:", error);
            set({ error: error.message });
            return Result.error(error.message);
        }

        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
        }));

        return Result.success(true);
    },
}));
