import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderItem, PaymentMethod } from "../types/order";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

export interface OrderInput {
  customerId: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  via: string;
  totalPrice: number; // 👈 sekarang total dikirim dari UI
}

interface OrderStoreState {
  orders: Order[];
  addOrder: (data: OrderInput) => void;
  updateOrder: (id: string, patch: Partial<Omit<Order, "id">>) => void;
  deleteOrder: (id: string) => void;
  clearAll: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (data) => {
        const now = new Date().toISOString();

        const newOrder: Order = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          ...data,
        };

        set({ orders: [...get().orders, newOrder] });
      },

      updateOrder: (id, patch) => {
        const now = new Date().toISOString();
        set({
          orders: get().orders.map((ord) =>
            ord.id === id ? { ...ord, ...patch, updatedAt: now } : ord
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
