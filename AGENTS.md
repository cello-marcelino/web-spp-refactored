# Project Architecture & Context: SPP Payment System

## 1. Konsep Arsitektur (Layered Architecture)
Proyek ini menggunakan arsitektur berlapis (Layered) murni berbasis Native JavaScript untuk memisahkan *concern* dan menghindari "God File".
- **Controllers**: Menangani request HTTP, validasi input, dan mengembalikan response (HTML/JSON).
- **Services**: Berisi murni *Business Logic* (Logika penentuan pembayaran, hashing password).
- **Repositories**: Satu-satunya layer yang boleh melakukan eksekusi query ke SQLite.
- **Views**: Halaman HTML murni.
- **Public**: Aset statis, CSS, dan Vanilla JS untuk interaktivitas dan reusable components.

## 2. Struktur Direktori
```text
/
├── src/
│   ├── config/          # Konfigurasi aplikasi & koneksi SQLite
│   ├── controllers/     # HTTP handler (AuthController, SiswaController, dll)
│   ├── services/        # Business logic (PaymentService, AuthService)
│   ├── repositories/    # Query Database (SiswaRepo, PaymentRepo)
│   ├── utils/           # Helper functions (UploadHandler, SessionManager)
│   └── views/           # File HTML per halaman (login.html, admin_dashboard.html)
│
├── public/
│   ├── css/             # Vanilla CSS (style.css, variables.css)
│   ├── js/              # Vanilla JS frontend (app.js, components/sidebar.js)
│   ├── uploads/         # Direktori penyimpanan foto struk (terproteksi)
│   └── assets/          # Gambar statis, logo
│
├── database/            # File SQLite (spp.db)
├── server.js            # Entry point Node.js Native Server
└── package.json         # Konfigurasi Node & dependencies (sqlite3, bcrypt)
```

## 3. Standar Frontend (Vanilla Component)
Karena kita tidak menggunakan framework frontend, komponen yang berulang (seperti Sidebar atau Navbar) **DILARANG** di-copy-paste ke setiap file HTML. 
- Buat file `public/js/components/sidebar.js`.
- Gunakan Vanilla JS `document.getElementById('sidebar-root').innerHTML = sidebarTemplate;` untuk me-render komponen pada setiap halaman.

## 4. Legacy Project Reference (Acuan Kode Lama)
Proyek lama yang belum di-refactor (Spaghetti Code PHP Native) tersedia 1 level di atas root direktori proyek ini, tepatnya di:
`../marcell-projects/Project-0/`

**Fungsi Direktori Ini:**
- HANYA digunakan sebagai acuan logika bisnis, alur data, atau referensi database lama.
- Lokasi ini berisi hasil audit evaluasi mendalam terkait celah keamanan dan *bug* yang harus dihindari di sistem baru.