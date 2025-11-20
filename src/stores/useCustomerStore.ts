import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "../types/customer";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

interface CustomerStoreState {
  customers: Customer[];
  addCustomer: (data: Omit<Customer, "id" | "createdAt" | "updatedAt">) => void;
  updateCustomer: (id: string, patch: Partial<Omit<Customer, "id">>) => void;
  deleteCustomer: (id: string) => void;
  clearAll: () => void;
}

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      customers: [],

      addCustomer: (data) => {
        const now = new Date().toISOString();
        const newCustomer: Customer = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          ...data,
        };
        set({ customers: [...get().customers, newCustomer] });
      },

      updateCustomer: (id, patch) => {
        const now = new Date().toISOString();
        set({
          customers: get().customers.map((cust) =>
            cust.id === id ? { ...cust, ...patch, updatedAt: now } : cust
          ),
        });
      },

      deleteCustomer: (id) => {
        set({
          customers: get().customers.filter((cust) => cust.id !== id),
        });
      },

      clearAll: () => set({ customers: [] }),
    }),
    {
      name: STORAGE_KEYS.customers,
    }
  )
);

setupZustandStorageSync(STORAGE_KEYS.customers, useCustomerStore);