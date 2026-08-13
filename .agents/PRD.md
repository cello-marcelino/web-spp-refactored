# Product Requirement Document (PRD)
**Project**: Web Pembayaran SPP (Refactored Version)

## 1. Tujuan Proyek
Merefaktorisasi sistem pembayaran SPP dari PHP Native (procedural) menjadi sistem modern berbasis Node.js Native dan Vanilla Web Technologies. Fokus utama adalah menambal seluruh celah keamanan (SQL Injection, XSS, Insecure Upload), menerapkan Layered Architecture murni, dan menghilangkan duplikasi kode (DRY).

## 2. Aktor & Hak Akses (Multi-Role)
1. **Master Admin**: Memiliki akses tertinggi. Dapat melakukan CRUD pada data Admin.
2. **Admin (Petugas)**: Mengelola operasional harian. Dapat melakukan CRUD data Siswa, melihat riwayat seluruh pembayaran, dan memvalidasi (terima/tolak) bukti pembayaran SPP.
3. **Siswa**: Pengguna akhir. Dapat login, melihat riwayat pembayarannya sendiri, dan mengunggah foto struk (receipt) pembayaran SPP.

## 3. Cakupan Fitur Utama
- **Authentication**: Login/Logout berbasis Session (bukan JWT, untuk menjaga kesederhanaan native) dengan pemisahan akses per-role.
- **User Management**: 
  - CRUD Admin (Hanya Master Admin).
  - CRUD Siswa (Hanya Admin).
- **Pembayaran SPP**:
  - Siswa dapat mengisi form bulan pembayaran dan mengunggah foto bukti transfer.
  - Admin dapat memvalidasi pembayaran (Pending -> Success/Rejected).
- **Dashboard & Reporting**:
  - **Siswa Dashboard**: Tabel riwayat status pembayaran pribadi.
  - **Admin Dashboard**: Statistik total siswa, widget ringkasan, dan Grafik (Chart.js) menampilkan rasio pembayaran tervalidasi vs belum bayar per bulan.

## 4. UI/UX Design System
- **Tema**: Clean, minimalis, profesional (didominasi warna putih, abu-abu, dengan aksen biru/hijau untuk status).
- **Layout**: Sidebar Navigation (kiri) dan Main Content Area (kanan).
- **Pendekatan**: HTML terpisah per halaman. Komponen berulang (seperti Sidebar dan Navbar) dirender/diinjeksi menggunakan Vanilla JavaScript (DOM Manipulation) untuk menghindari copy-paste HTML.