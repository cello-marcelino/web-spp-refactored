# Web Pembayaran SPP (Refactored Version)

Selamat datang di repositori Web Pembayaran SPP! Proyek ini merupakan versi pembaruan (*refactored*) revolusioner dari kode lawas yang bertujuan untuk meningkatkan standar keamanan tingkat tinggi, merapikan struktur kode secara drastis, serta menghadirkan antarmuka (UI/UX) yang jauh lebih modern dan dinamis.

## 🚀 Sekilas Tentang Update Versi Ini
- **Keamanan Lapis Baja**: Terlindungi total dari serangan *SQL Injection* (berkat *Parameterized Queries*) dan mengamankan kata sandi menggunakan algoritma enkripsi *Bcrypt Hashing*. Akses halaman dilindungi *Middleware Session* ketat.
- **Dasbor Cerdas & Interaktif**: Dilengkapi grafik analitik modern (*Chart.js*) yang dapat di-klik untuk memunculkan matriks rasio pembayaran spesifik per bulannya secara instan.
- **Master Data Dinamis**: Biaya tagihan SPP bulanan kini diatur secara dinamis per Jurusan dari panel admin, sehingga ketika terjadi kenaikan/penurunan biaya, efeknya menetes otomatis ke seluruh siswa.
- **Modul Tagihan Anti-Repot**: Kalender tagihan 12 bulan yang tersinkronisasi murni dengan status di pangkalan data (*database*), lengkap dengan opsi transaksi ulang otomatis jika bukti pembayaran sebelumnya ditolak Admin.

## 🛠️ Stack Teknologi & Alat (*Tools*)
Aplikasi ini sengaja dibangun menggunakan **Native Stack** tanpa menggunakan *framework* web (seperti Express, Laravel, atau React) demi membuktikan performa arsitektur tingkat tinggi dari komponen murni:
- **Backend/Server**: Node.js Native (*built-in module `http` & `fs`*)
- **Database**: SQLite3
- **Kriptografi**: Bcrypt
- **Frontend**: HTML5, Vanilla JavaScript (JS Murni), & Vanilla CSS Murni.
- **Visualisasi Data**: Chart.js.

## 📂 Struktur Arsitektur (Layered Architecture)
Kode proyek ini sangat profesional karena dipisah secara ketat (*Separation of Concerns*) tanpa ada "God File":
- `src/config/`: Pengaturan inti dan inisiasi koneksi *Database*.
- `src/controllers/`: Mengatur persimpangan lalu lintas *Request* & *Response* HTTP.
- `src/services/`: Area isolasi untuk Logika Bisnis (*Business Logic*) aplikasi.
- `src/repositories/`: Satu-satunya gerbang (*Query Engine*) yang diizinkan memanggil *Database*.
- `src/views/`: Halaman-halaman fondasi kerangka HTML.
- `public/`: Akses gerbang eksternal untuk menyimpan CSS, logika DOM, gambar, dan aset resi.

## 💻 Cara Menjalankan Secara Lokal (*Local Setup*)
Ikuti langkah-langkah di bawah ini untuk menghidupkan *server* lokal Anda:

1. Pastikan Anda telah memasang **[Node.js](https://nodejs.org)** di komputer Anda.
2. Buka aplikasi Terminal (CMD / PowerShell / Git Bash) dan arahkan ke direktori (*folder*) proyek ini.
3. Jalankan perintah instalasi pustaka dependensi berikut:
   ```bash
   npm install
   ```
4. *(Opsional namun disarankan)* Lakukan injeksi data *dummy* awal (Seeding) agar pangkalan data langsung terisi dengan 1 admin dan 50 siswa untuk simulasi:
   ```bash
   npm run seed
   ```
5. Hidupkan mesin *server* aplikasi:
   ```bash
   node server.js
   ```
   *(Catatan: Anda juga bisa menggunakan `npm run dev` jika ingin server me-refresh dirinya secara otomatis saat Anda mengubah baris kode).*
6. Buka peramban internet (*Browser*) Anda lalu akses URL berikut:
   `http://localhost:3000`

### 🔑 Informasi Akses Masuk (*Login Dummy*)
Jika Anda telah menjalankan perintah `npm run seed`, sistem akan terisi dengan data simulasi berikut:
- **Role Admin Utama** 
  - Username: `admin` | Password: `admin123`
- **Role Siswa Simulasi** (50 Siswa terbagi di berbagai jurusan)
  - Contoh Username: `budi0`, `siti1`, `dewi3`, hingga `zara49`
  - Password Seragam: `siswa123`
