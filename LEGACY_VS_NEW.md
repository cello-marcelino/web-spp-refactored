# Perbandingan Sistem: Versi Legacy vs Versi Baru (Refactored)

Dokumen ini merangkum evolusi besar yang terjadi pada aplikasi **Web Pembayaran SPP** dari versi *Legacy* (kode usang) ke Versi Terbaru (*Modern Architecture*). Proses *refactoring* ini tidak hanya berfokus pada estetika, namun terlebih kepada keamanan tingkat tinggi dan skalabilitas infrastruktur *Backend*.

---

## 1. Arsitektur Kode & Teknologi Dasar
| Fitur/Sektor | Versi Legacy (Lama) | Versi Baru (Terkini) |
|---|---|---|
| **Tech Stack** | PHP Native (Procedural) + MySQL | Node.js Native + SQLite |
| **Pola Desain** | *Spaghetti Code* (Logika DB, HTML, Routing bercampur dalam 1 file) | **Layered Architecture Murni** (Pemisahan ketat: *Controllers*, *Repositories*, *Services*, *Views*) |
| **Frontend** | Duplikasi HTML masif (Copy-paste *Sidebar/Navbar* di setiap halaman) | **Vanilla JS Components** (*Sidebar* & *Topbar* dirender melalui satu file JS secara dinamis `DOM Injection`) |
| **Routing** | Bergantung pada nama file `.php` murni yang diekspos secara publik. | **Custom Node Router** (Pemusatan kendali URL; file `.html` dan logika API diproteksi total di balik server). |

## 2. Peningkatan Keamanan Lanjutan (Security)
| Aspek Keamanan | Versi Legacy (Lama) | Versi Baru (Terkini) |
|---|---|---|
| **SQL Injection** | Sangat rentan (menggabungkan variabel mentah langsung ke dalam sintaks SQL `$_POST`). | Kebal! Menggunakan **Parameterized Queries** (`?`) di setiap interaksi *database* (melalui modul *sqlite3*). |
| **Kriptografi** | Kata sandi (*password*) disimpan mentah (Plain Text). | Menggunakan **Bcrypt Hashing** dengan *Salt* level 10. Admin tertinggi pun tidak bisa melihat *password* siswa. |
| **Otorisasi Data** | Sering bocor (*Siswa* bisa saja mengakses halaman admin dengan menebak URL). | **Role-Based Access Control (RBAC)** ketat di sisi *Middleware* `server.js`. Akses URL disaring berdasarkan sesi (*Session*). |
| **File Statis** | Folder kode aplikasi bisa diakses melalui *Browser* secara langsung. | Struktur **Root vs Public**. Hanya folder `public/` yang diekspos ke publik, logika aplikasi di folder `src/` mustahil diakses dari luar. |

## 3. Revolusi Struktur Basis Data (*Database*)
- **Legacy**: Nominal SPP diketik manual atau statis tanpa relasi yang logis.
- **Baru**: Implementasi Tabel **Master Data (`tb_tarif`)** yang berdiri sendiri, berisi skenario tarif berdasarkan Jurusan. Tabel ini memiliki relasi *One-to-Many* dengan `tb_siswa`. Ketika Admin mengganti nama jurusan atau tarif SPP di Master Data, tagihan seluruh siswa di jurusan tersebut akan otomatis menyesuaikan!

## 4. UI/UX & Antarmuka Aplikasi
- **Layouting Cerdas**: Beralih dari halaman kaku menuju desain dinamis (*Fixed Sidebar* & *Sticky Topbar*). Konten utama dapat di-*scroll* tanpa menggulung menu navigasi.
- **Konsistensi Visual**: Mewarisi gaya tipografi (*font-family*) kebanggaan versi lama, namun membalutnya dengan *Card UI*, palet warna elegan, dan transisi modern.
- **Modals / Popups**: Penghapusan *prompt alert browser* klasik, digantikan oleh *Custom HTML Modal* yang bersih untuk aksi CRUD (Tambah/Edit).

## 5. Lompatan Fitur Fungsional
1. **Dasbor Analitik (Admin)** 📊
   - *Legacy*: Hanya tabel statis.
   - *Baru*: Menggunakan **Chart.js**. Menampilkan data Tren Pembayaran dan Rasio Pembayaran. Lebih canggih lagi, *Admin* dapat **mengklik** salah satu bulan di grafik batang, dan *widget* rasio di atasnya akan langsung berubah secara spesifik menyorot performa bulan tersebut!
2. **Modul Tagihan Cerdas (Siswa)** 💳
   - *Legacy*: Siswa mengetik sendiri bulan yang ingin dibayar. Rawan *human error*.
   - *Baru*: Siswa disediakan kalender *12 Bulan Tagihan*. Modul ini langsung menyedot data historis. Jika bulan sudah dibayar, gembok akan terkunci (*Disabled* & Hijau). Jika sedang diperiksa, akan berstatus kuning.
3. **Bayar Ulang / Re-Transaction (Siswa)** ♻️
   - Jika pembayaran sebelumnya **Ditolak (Rejected)** oleh Admin, siswa tidak dibiarkan kebingungan. Ada tombol merah khusus *"Bayar Ulang"* yang secara otomatis mengarahkan ke form dengan data bulan yang bersangkutan tanpa perlu mengisi ulang.
4. **Beranda & Profil Terpusat** 🏠
   - Seluruh pengguna memiliki laman *"Beranda"* spesifik. *Siswa* dapat melihat status kawan-kawan satu sekolahnya, jumlah siswa per jurusan, beserta tarif sekolah transparan.
   - Tersedia modul pengaturan **Profil Akun** yang bisa diakses dengan sekali klik dari bilah atas (*Topbar*).

---
*Dokumen ini dibuat otomatis oleh Sistem sebagai rekam jejak penyelesaian proyek modernisasi arsitektur web.*
