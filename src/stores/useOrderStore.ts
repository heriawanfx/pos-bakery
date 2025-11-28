import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderItem, PaymentMethod } from "../types/order";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

export interface OrderInput {
  customer_id: number;
  items: OrderItem[];
  payment_method: PaymentMethod;
  order_via: string;
  total_price: number; // 👈 sekarang total dikirim dari UI
}

interface OrderStoreState {
  orders: Order[];
  addOrder: (data: OrderInput) => void;
  updateOrder: (id: number, patch: Partial<Omit<Order, "id">>) => void;
  deleteOrder: (id: number) => void;
  clearAll: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (data) => {
        const now = new Date().toISOString();

        const newOrder: Order = {
          id: -1,
          created_at: now,
          updated_at: now,
          ...data,
        };

        set({ orders: [...get().orders, newOrder] });
      },

      updateOrder: (id, patch) => {
        const now = new Date().toISOString();
        set({
          orders: get().orders.map((ord) =>
            ord.id === id ? { ...ord, ...patch, updated_at: now } : ord
          ),
        });
      },

      deleteOrder: (id) => {
        set({
          orders: get().orders.filter((ord) => ord.id !== id),
        });
      },

      clearAll: () => set({ orders: [] }),
    }),
    {
      name: STORAGE_KEYS.orders,
    }
  )
);

// 🔁 sync antar tab
setupZustandStorageSync(STORAGE_KEYS.orders, useOrderStore);
