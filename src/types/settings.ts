// src/types/settings.ts
export interface AppSettings {
  siteName: string;        // Nama aplikasi untuk judul / dashboard
  appName: string;         // Nama app di NavBar / Sidebar
  tagline: string;         // Tagline pendek
  businessName: string;    // Nama usaha
  ownerName: string;       // Nama pemilik (optional)
  lowStockThreshold: number; // Batas stok low stock (dipakai dashboard)
}
