# Coding Rules & Security Constraints

## 1. Aturan Keamanan Mutlak (CRITICAL)
- **NO SQL INJECTION**: DILARANG KERAS menggunakan string interpolasi (`${var}`) untuk query SQL. SELALU gunakan Parameterized Query bawaan library SQLite (`?` atau `$param`).
- **NO PLAINTEXT PASSWORDS**: Semua password HARUS di-hash menggunakan `bcrypt` sebelum disimpan ke database. Saat login, gunakan `bcrypt.compare()`.
- **SECURE FILE UPLOAD**: Validasi ekstensi file gambar (hanya `jpg, jpeg, png`), batasi ukuran file maksimal 2MB, dan **GANTI nama file** menggunakan UUID/Timestamp sebelum disimpan ke folder `/uploads/`.
- **PREVENT XSS**: Pastikan semua data dinamis dari database di-escape (sanitasi) sebelum dirender ke HTML.
- **STRICT SESSION**: Setiap endpoint dan halaman dashboard wajib memiliki *middleware / guard* pengecekan sesi. Jika tidak ada sesi aktif, redirect ke login.

## 2. Arsitektur & Kualitas Kode
- **NO GOD FILES**: Setiap file fungsi harus memiliki tanggung jawab tunggal (Single Responsibility Principle). Maksimal ~100-150 baris per file.
- **Kompak & Rapi**: Tulis kode yang compact, terstruktur, jelas, dan modular. Gunakan penamaan variabel yang deskriptif (hindari penamaan seperti `$data`, `$sql`).
- **Hindari Dead Code**: Pastikan logika percabangan (`if/else`) efisien. Hindari kondisi array yang dibandingkan dengan integer (contoh: `if (array > 0)` adalah ILEGAL).
- **Error Handling**: Setiap operasi database dan asinkronus (`async/await`) WAJIB dibungkus dengan `try-catch`. Jangan biarkan error bocor ke sisi client.

## 3. Standar Frontend (UI/CSS)
- **Vanilla CSS**: Gunakan CSS Variables (`:root`) untuk warna primer, sekunder, dan *spacing* agar UI konsisten dan rapi.
- **Clean Design**: Hindari tag usang seperti `<font>`. Gunakan Flexbox atau CSS Grid untuk layout. Hindari *inline styles* (`style="..."`), letakkan semua styling di file CSS eksternal.