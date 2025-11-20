🍞 PoS Bakery — Aplikasi Point of Sale untuk Usaha Kue RumahanPoS Bakery adalah aplikasi Point of Sale sederhana yang berjalan sepenuhnya di browser dan cocok untuk usaha bakery/kue rumahan.Aplikasi ini membantu mengelola:

- Bahan baku (stok, harga, satuan)
- Kategori produk
- Produk beserta perhitungan otomatis HPP (harga pokok produksi)
- Data pelanggan
- Pesanan & transaksi
- Laporan ringkas di dashboard (penjualan, profit, produk terlaris)
- Penyimpanan data di LocalStorage (offline-friendly)
- UI responsif dengan dark mode & light mode
- Toast notification dan error boundary

Tidak memerlukan backend — cukup buka di browser.

---

## ✨ Fitur Utama

### 🧾 Manajemen Bahan (Ingredients)

- Kelola stok bahan
- Harga beli & satuan (gram, ml, pcs, dll)
- Perhitungan otomatis konsumsi bahan pada produk
- Peringatan stok menipis (low stock)

### 🍪 Manajemen Produk

- Input bahan penyusun dan jumlah pemakaian
- Hitung otomatis HPP (Cost of Goods Sold)
- Harga jual & margin persentase
- Kategori produk (Nastar, Putri Salju, dll)

### 👥 Manajemen Pelanggan

- Nama
- Alamat
- Nomor telepon / WhatsApp

### 🛒 Manajemen Pesanan

- Pilih pelanggan
- Pilih produk dan jumlah
- Metode pembayaran (Cash/Transfer)
- Kanal pesanan (WhatsApp, Instagram, dll)
- Total pembayaran otomatis
- Hitung profit dan omzet

### 📊 Dashboard Analitik

- Total omzet
- Total profit
- Profit bulan ini
- Nilai order rata-rata
- Daftar pesanan terbaru
- Produk terlaris
- Ingredients low stock

### 🎨 Tampilan UI/UX

- Tailwind CSS v3
- Sistem desain custom (Card, Button, Modal, Input, Select)
- Ikon dari lucide-react
- Sidebar responsif (mobile + desktop)
- Toast notifikasi
- Error boundary global

---

## 🧰 Teknologi yang Digunakan

| Teknologi                           | Keterangan                          |
| ----------------------------------- | ----------------------------------- |
| **React + TypeScript**        | Framework utama                     |
| **Vite**                      | Development & build tool cepat      |
| **Zustand**                   | State management + LocalStorage     |
| **React Router (HashRouter)** | Routing SPA kompatibel GitHub Pages |
| **Tailwind CSS v3**           | Utility-first styling               |
| **Lucide React**              | Ikon modern                         |
| **LocalStorage**              | Penyimpanan data lokal (offline)    |

---

## 🚀 Menjalankan Secara Lokal

### 1. Clone repository

``git clone https://github.com/heriawanfx/pos-bakery``
``cd pos-bakery``

### 2. Instal dependensi

``npm install``

### 3. Jalankan development server

``npm run dev``

### 4. Build untuk produksi

``npm run build``

### 5. Preview produksi

``npm run preview``

## 🌐 Deploy ke GitHub Pages

Aplikasi ini menggunakan HashRouter, sehingga kompatibel sepenuhnya dengan GitHub Pages.

### Instal gh-pages

``npm install --save-dev gh-pages``

### Tambahkan script di package.json

```
"scripts": {
 "deploy": "vite build && gh-pages -d dist"
}
```


### Deploy

``npm run deploy``

### Aplikasi akan tersedia di:

``https://heriawanfx.github.io/pos-bakery/``

## 📦 Struktur Project (Ringkas)

```
src/
 ├─ components/
 │   ├─ ui/            # Komponen desain sistem (Button, Card, Modal, Toast, dll)
 │   ├─ products/
 │   ├─ orders/
 │   ├─ customers/
 │   └─ ingredients/
 ├─ stores/            # Zustand stores
 ├─ pages/             # Halaman / Routes
 ├─ utils/             # Helper dan fungsi kalkulasi
 ├─ router/            # HashRouter
 ├─ App.tsx
 ├─ main.tsx
 └─ index.css          # Import Tailwind CSS
```

## 🛡 Lisensi

Project ini dirilis dengan lisensi MIT License.

Artinya:
- Bebas digunakan untuk proyek pribadi maupun komersial
- Bebas dimodifikasi dan didistribusikan
- Tidak ada jaminan (as is)
- Hanya harus mempertahankan copyright notice

## 🤝 Kontribusi

Pull Request sangat diterima!
Silakan buat issue jika Anda ingin menambahkan fitur:
- Laporan periodik lengkap
- Grafik penjualan
- Sinkronisasi cloud
- Export/import dataset

❤️ Tentang Proyek
PoS Bakery dibuat untuk membantu pemilik usaha kecil seperti:
- Nastar rumahan
- Putri Salju
- Kastengel
- Kue kering
- Pastry
- dan berbagai usaha bakery UMKM lainnya.

Sederhana, ringan, dan mudah digunakan — cukup buka browser dan langsung pakai.
Selamat membangun bisnis kue Anda! 🍪🎉
