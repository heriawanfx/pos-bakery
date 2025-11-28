// src/types/settings.ts
export interface AppSettings {
  site_name: string;        // Nama aplikasi untuk judul / dashboard
  app_name: string;         // Nama app di NavBar / Sidebar
  tagline: string;         // Tagline pendek
  business_name: string;    // Nama usaha
  owner_name: string;       // Nama pemilik (optional)
  low_stock_threshold: number; // Batas stok low stock (dipakai dashboard)
}
