# TODO: Refactoring SPP Payment Logic

## 1. Persiapan & Konfigurasi
- [x] Tentukan/Update penamaan kolom database untuk tabel `pembayaran` (Koreksi `recipt` -> `receipt_file`, `succes` -> `success` jika diizinkan).
- [x] Buat file `src/config/database.js` untuk koneksi SQLite bawaan Node.js.
- [x] Buat file `package.json` dan inisialisasi modul yang dibutuhkan (misal: `sqlite3`, `bcrypt`, dan `formidable` jika disetujui).

## 2. Utility Layer
- [x] Buat `src/utils/UploadHandler.js`:
  - Implementasi fungsi validasi ekstensi (`.jpg`, `.jpeg`, `.png`).
  - Implementasi fungsi validasi ukuran maksimal (2MB).
  - Implementasi *secure renaming* menggunakan UUID atau timestamp (untuk menghindari *directory traversal* / bentrok nama file).
- [x] Buat `src/utils/SessionManager.js`:
  - Implementasi fungsi pengecekan sesi aktif per-role (Admin/Petugas/Siswa).

## 3. Repository Layer
- [x] Buat `src/repositories/PaymentRepo.js`:
  - Implementasi query `createPayment(data)` dengan Parameterized Query (mencegah SQL Injection).
  - Implementasi query `updateStatus(id_pembayaran, status)` dengan Parameterized Query.

## 4. Service Layer
- [x] Buat `src/services/PaymentService.js`:
  - Implementasi fungsi `processPaymentSubmission()` yang menghubungkan logika file upload dari `UploadHandler` dan insert data dari `PaymentRepo`.
  - Implementasi fungsi `processStatusUpdate()` untuk mengatur perubahan status bayar menjadi `success` atau `rejected` dengan proteksi otorisasi pengguna.
  - Bungkus seluruh logika di dalam block `try-catch` yang kuat.

## 5. Controller & Presentation Layer
- [x] Buat `src/controllers/PaymentController.js`:
  - Buat handler endpoint `submitPayment(req, res)` (termasuk *parsing* `multipart/form-data`).
  - Buat handler endpoint `updatePaymentStatus(req, res)`.
- [x] Integrasi ke `server.js`:
  - Tambahkan routing HTTP native untuk menghubungkan URL endpoint ke `PaymentController`.

## 6. Testing & Verifikasi
- [ ] Lakukan *Manual Testing* untuk upload gambar valid (berhasil masuk DB dan folder `/public/uploads/`).
- [ ] Lakukan *Manual Testing* untuk upload gambar melebih 2MB atau ekstensi tidak valid (harus error aman).
- [ ] Lakukan uji coba konfirmasi/tolak (Update DB status) sebagai admin.
- [ ] Uji coba proteksi session (akses endpoint tanpa hak akses).
