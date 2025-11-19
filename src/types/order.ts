export type PaymentMethod = "cash" | "transfer";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  via: string;            // e.g. WhatsApp, Instagram, Shopee
  totalPrice: number;     // auto calculated from items
  createdAt: string;
  updatedAt: string;
}
