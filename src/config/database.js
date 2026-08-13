const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '../../database');
const dbPath = path.resolve(dbDir, 'spp.db');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Create pembayaran table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS pembayaran (
                id_pembayaran INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_siswa TEXT NOT NULL,
                kelas TEXT NOT NULL,
                jurusan TEXT NOT NULL,
                nisn TEXT NOT NULL,
                no_spp TEXT NOT NULL,
                receipt_file TEXT NOT NULL,
                tgl_bayar TEXT NOT NULL,
                bulan_spp TEXT NOT NULL,
                nominal INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
            )
        `);

        // Additional tables like tb_siswa and tb_admin can be created here as well based on legacy
        db.run(`
            CREATE TABLE IF NOT EXISTS tb_siswa (
                id_siswa INTEGER PRIMARY KEY AUTOINCREMENT,
                nama_siswa TEXT NOT NULL,
                kelas TEXT NOT NULL,
                jurusan TEXT NOT NULL,
                no_spp TEXT NOT NULL,
                nisn TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'siswa',
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS tb_admin (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nama TEXT NOT NULL,
                email TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `);
    });
}

module.exports = db;
