import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "../types/customer";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";
import { Result } from "../utils/result";
import { supabase } from "../utils/supabase";

interface CustomerStoreState {
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;

  customers: Customer[];
  addCustomer: (data: Pick<Customer, "name"|"address"|"phone">) => Promise<Result<Customer>>;
  updateCustomer: (id: number, patch: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>) => Promise<Result<Customer>>;
  deleteCustomer: (id: number) => Promise<Result<Boolean>>;
  clearAll: () => void;
}

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      loading: false,
      error: null,
      customers: [],

      fetch: async () => {

        const { data, error } = await supabase.from('customers')
          .select("id, name, address, phone, created_at, updated_at")
          .order("created_at");

        if (error) {
          set({ error: error.message });
          return;
        }

        set({ loading: false, customers: data });
      },


      addCustomer: async (input) => {
        const { data: newData, error } = await supabase.from('customers')
          .insert(input)
          .select("id, name, address, phone, created_at, updated_at")
          .single();

        if (error) {
          set({ error: error.message });
          return Result.error(error.message);
        }

        set({ customers: [...get().customers, newData] });

        return Result.success(newData);
      },

      updateCustomer: async (id, patch) => {
        const {data: updated, error} = await supabase.from('customers')
				.update(patch)
				.eq("id", id)
          .select("id, name, address, phone, created_at, updated_at")
				.single();

				if (error) {
						set({ error: error.message });
						return Result.error(error.message);
				}

        set({
          customers: get().customers.map((row) =>
            row.id === id ? updated : row
          ),
        });

				return Result.success(updated);
      },

      deleteCustomer: async (id) => {
        const { error} = await supabase.from('customers')
				.delete()
				.eq("id", id);

				if (error) {
						set({ error: error.message });
						return Result.error(error.message);
				}

        set({ customers: get().customers.filter((row) => row.id !== id) });
				
				return Result.success(true);
      },

      clearAll: () => set({ customers: [] }),
    }),
    {
      name: STORAGE_KEYS.customers,
    }
  )
);

setupZustandStorageSync(STORAGE_KEYS.customers, useCustomerStore);