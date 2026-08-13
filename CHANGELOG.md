# Changelog SPP Pay

Semua perubahan yang tercatat di dokumen ini diurutkan berdasarkan implementasi sejak versi *Frontend UI* pertama diintegrasikan.

## [Terkini] - 2026-08-14

### 🚀 Fitur Baru (New Features)
- **Siswa Landing Page**: Halaman beranda eksklusif untuk Siswa yang menampilkan rekapitulasi sekolah dan skenario biaya SPP untuk seluruh jurusan (`5b5a0a3`).
- **Manajemen Jurusan & Tarif (Admin)**: Penambahan *Control Panel* Master Data untuk melakukan CRUD (Tambah, Edit, Hapus) daftar jurusan dan besaran tarif SPP (`ab2cc93`).
- **Modul Tagihan Bulanan Interaktif**: Fitur 12 bulan (1 tahun penuh) pada halaman pembayaran siswa. Warna dan status akan terkunci secara otomatis berdasarkan pembacaan riwayat *database* (`9278001`).
- **Bayar Ulang (Re-Transaction)**: Tombol aksi khusus pada tabel riwayat siswa untuk mengirim ulang bukti transaksi jika pembayaran sebelumnya berstatus *Ditolak* (`3b2df68`).
- **Manajemen Profil**: Siswa dan Admin kini dapat melihat dan mengelola profil akun masing-masing melalui fitur Topbar (`01c66fb`, `015e04f`).

### 🎨 Peningkatan UI/UX (Enhancements)
- **Desain Layar Dinamis**: Membekukan posisi Sidebar (*fixed layout*) dan menyisipkan *Sticky Topbar* agar tidak ikut tergulung saat *scroll* (`015e04f`, `1ed11ac`).
- **Interaktivitas Grafik (Dashboard)**: Rasio persentase pada panel statistik sekarang dapat berubah secara dinamis setiap kali *Admin* mengklik pilar bulan spesifik pada diagram batang (`9cceb7d`).
- **Typography Legacy**: Mengembalikan pengaturan *font-family* menggunakan tipografi aplikasi lawas demi konsistensi visual identitas sekolah (`fa81943`).
- **Estetika Dashboard Admin**: Peningkatan drastis pada visual dasbor menggunakan elemen *cards*, palet warna yang kohesif, metrik pendapatan (*revenue*), dan desain *Chart.js* yang lebih modern (`c79ba9d`, `fa67baa`).

### 🐛 Perbaikan Kutu (Bug Fixes)
- **404 Logout Error**: Memperbaiki rute tautan *Logout* pada Topbar yang sebelumnya mengarah ke halaman yang tidak ditemukan (`1e066ab`).
- **Bukti Transaksi Tidak Muncul (404)**: Menambal *bug* kegagalan pembacaan aset dengan merekonstruksi folder `/public/uploads` dan menyisipkan berkas resi bawaan/dummy (`28eab7a`).
- **Caching & Rejected Metrics**: Memperbaiki isu tembolok (*caching*) data statistik Dasbor dan memasukkan metrik "Ditolak" agar perhitungan rasio lebih akurat (`46dc732`).

### ⚙️ Sistem & Arsitektur (Backend)
- **Relasi Tarif Jurusan**: Integrasi tabel `tb_tarif` ke dalam alur logika pembayaran sehingga nominal tagihan siswa ter-autofill dengan presisi sesuai prodi jurusannya (`fa67baa`).
- **User Management Layer**: Integrasi *Role-Based Access Control* penuh untuk CRUD Admin & Petugas secara *native* (`ec20795`, `78301d9`).
- **Dokumentasi Proyek**: Sinkronisasi fitur-fitur baru ke dalam arsitektur `AGENTS.md` dan `.agents/PRD.md` (`6f3f3ee`).

---
*Catatan Historis: Laporan ini direkap mulai dari titik komit "Add frontend UI for manual testing" (`ddb5e5a`).*
