import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderItem, PaymentMethod } from "../types/order";
import { STORAGE_KEYS } from "../constants/storageKeys";

export interface OrderInput {
  customerId: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  via: string;
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

        // Total akan dihitung betul nanti (pakai products + harga)
        const totalPrice = 0;

        const newOrder: Order = {
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          totalPrice,
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
