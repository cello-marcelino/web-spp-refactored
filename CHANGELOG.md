# Changelog SPP Pay

Semua perubahan yang tercatat di dokumen ini diurutkan berdasarkan implementasi sejak versi *Frontend UI* pertama diintegrasikan.

## [Terkini] - 2026-08-14

### 🚀 Fitur Baru (New Features)
- **Siswa Landing Page**: Halaman beranda eksklusif untuk Siswa yang menampilkan rekapitulasi sekolah dan skenario biaya SPP untuk seluruh jurusan.
- **Manajemen Jurusan & Tarif (Admin)**: Penambahan *Control Panel* Master Data untuk melakukan CRUD (Tambah, Edit, Hapus) daftar jurusan dan besaran tarif SPP.
- **Modul Tagihan Bulanan Interaktif**: Fitur 12 bulan (1 tahun penuh) pada halaman pembayaran siswa. Warna dan status akan terkunci secara otomatis berdasarkan pembacaan riwayat *database*.
- **Bayar Ulang (Re-Transaction)**: Tombol aksi khusus pada tabel riwayat siswa untuk mengirim ulang bukti transaksi jika pembayaran sebelumnya berstatus *Ditolak*.
- **Manajemen Profil**: Siswa dan Admin kini dapat melihat dan mengelola profil akun masing-masing melalui fitur Topbar.

### 🎨 Peningkatan UI/UX (Enhancements)
- **Desain Layar Dinamis**: Membekukan posisi Sidebar (*fixed layout*) dan menyisipkan *Sticky Topbar* agar tidak ikut tergulung saat *scroll*.
- **Interaktivitas Grafik (Dashboard)**: Rasio persentase pada panel statistik sekarang dapat berubah secara dinamis setiap kali *Admin* mengklik pilar bulan spesifik pada diagram batang.
- **Typography Legacy**: Mengembalikan pengaturan *font-family* menggunakan tipografi aplikasi lawas demi konsistensi visual identitas sekolah.
- **Estetika Dashboard Admin**: Peningkatan drastis pada visual dasbor menggunakan elemen *cards*, palet warna yang kohesif, metrik pendapatan (*revenue*), dan desain *Chart.js* yang lebih modern.

### 🐛 Perbaikan Kutu (Bug Fixes)
- **404 Logout Error**: Memperbaiki rute tautan *Logout* pada Topbar yang sebelumnya mengarah ke halaman yang tidak ditemukan.
- **Bukti Transaksi Tidak Muncul (404)**: Menambal *bug* kegagalan pembacaan aset dengan merekonstruksi folder `/public/uploads` dan menyisipkan berkas resi bawaan/dummy.
- **Caching & Rejected Metrics**: Memperbaiki isu tembolok (*caching*) data statistik Dasbor dan memasukkan metrik "Ditolak" agar perhitungan rasio lebih akurat.

### ⚙️ Sistem & Arsitektur (Backend)
- **Relasi Tarif Jurusan**: Integrasi tabel `tb_tarif` ke dalam alur logika pembayaran sehingga nominal tagihan siswa ter-autofill dengan presisi sesuai prodi jurusannya.
- **User Management Layer**: Integrasi *Role-Based Access Control* penuh untuk CRUD Admin & Petugas secara *native*.
- **Dokumentasi Proyek**: Sinkronisasi fitur-fitur baru ke dalam arsitektur `AGENTS.md` dan `.agents/PRD.md`.

---
*Catatan Historis: Laporan ini direkap mulai dari titik komit "Add frontend UI for manual testing".*
