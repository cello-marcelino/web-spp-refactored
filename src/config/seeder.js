const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/spp.db');
const db = new sqlite3.Database(dbPath);

async function seed() {
    console.log("Seeding Database...");
    const saltRounds = 10;
    const defaultPassword = 'password123';
    
    try {
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        // Seed Admin
        const insertAdmin = `INSERT INTO tb_admin (nama, email, username, password, role) VALUES (?, ?, ?, ?, ?)`;
        db.run(insertAdmin, ['Master Admin', 'admin@sekolah.com', 'admin', hashedPassword, 'admin'], (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    console.log('Admin already seeded.');
                } else {
                    console.error('Error seeding admin:', err.message);
                }
            } else {
                console.log('Admin seeded successfully (username: admin, password: password123)');
            }
        });

        // Seed Siswa
        const insertSiswa = `INSERT INTO tb_siswa (nama_siswa, kelas, jurusan, no_spp, nisn, role, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertSiswa, ['Budi Santoso', 'XII', 'RPL', 'SPP-001', '123456789', 'siswa', 'siswa', hashedPassword], (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    console.log('Siswa already seeded.');
                } else {
                    console.error('Error seeding siswa:', err.message);
                }
            } else {
                console.log('Siswa seeded successfully (username: siswa, password: password123)');
            }
        });

    } catch (error) {
        console.error("Failed to hash password:", error);
    }
}

seed();
