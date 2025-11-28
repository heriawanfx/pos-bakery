export type PaymentMethod = "cash" | "transfer";

export interface OrderItem {
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;   
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  payment_method: PaymentMethod;
  order_via: string;            // e.g. WhatsApp, Instagram, Shopee
  total_price: number;     // auto calculated from items
  created_at: string;
  updated_at: string | null;
  
  items: OrderItem[];
}
