const db = require('../../src/config/database');
const bcrypt = require('bcrypt');

const adminPassword = bcrypt.hashSync('admin123', 10);
const siswaPassword = bcrypt.hashSync('siswa123', 10);

const indonesianNames = [
    "Budi Santoso", "Siti Aminah", "Ahmad Hidayat", "Dewi Lestari", "Rizky Aditya", 
    "Putri Anindya", "Fajar Nugroho", "Rina Amelia", "Agus Setiawan", "Sari Permata",
    "Dimas Pratama", "Nadia Safitri", "Rangga Wijaya", "Indah Susanti", "Kevin Mahendra",
    "Ayu Maharani", "Gilang Ramadhan", "Dian Sastrowardoyo", "Wahyu Kusuma", "Eka Puspita",
    "Hendra Gunawan", "Mega Utami", "Reza Rahadian", "Ratna Galih", "Bayu Saputra",
    "Maya Wulandari", "Joko Anwar", "Rini Yulianti", "Yudi Pratama", "Fitri Handayani",
    "Arif Rahman", "Siska Nurhaliza", "Doni Salmanan", "Nina Zatulini", "Ilham Akbar",
    "Tika Panggabean", "Andre Taulany", "Maudy Ayunda", "Denny Sumargo", "Gisella Anastasia",
    "Rafi Ahmad", "Nagita Slavina", "Iqbaal Ramadhan", "Vanesha Prescilla", "Adipati Dolken",
    "Anya Geraldine", "Jefri Nichol", "Prilly Latuconsina", "Angga Yunanda", "Zara JKT48"
];

const jurusans = ['RPL', 'TKJ', 'Multimedia', 'Akuntansi', 'Perhotelan', 'Tata Boga'];
const kelases = ['10', '11', '12'];

console.log('🔄 Memulai proses seeding data...');

db.serialize(() => {
    // 1. Clear old data
    db.run('DELETE FROM tb_siswa');
    db.run('DELETE FROM tb_admin');
    
    // reset sequence
    db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tb_siswa'");
    db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tb_admin'");

    console.log('✅ Data lama berhasil dibersihkan.');

    // 2. Insert Admin
    db.run(`INSERT INTO tb_admin (nama, email, username, password, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Administrator', 'admin@spp.com', 'admin', adminPassword, 'admin'], (err) => {
            if(err) console.error("❌ Error inserting admin:", err);
            else console.log("✅ Akun Admin berhasil dibuat (Username: admin | Password: admin123)");
        });

    // 3. Insert 50 Students
    const stmt = db.prepare(`INSERT INTO tb_siswa (nama_siswa, kelas, jurusan, no_spp, nisn, role, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    
    indonesianNames.forEach((name, index) => {
        const jurusan = jurusans[index % jurusans.length];
        const kelasTingkat = kelases[index % kelases.length];
        const kelas = `${kelasTingkat} ${jurusan}`;
        const noSpp = `SPP-${1000 + index}`;
        const nisn = `2026${String(index).padStart(4, '0')}`;
        
        // username format: first name lowercased + index (e.g. budi0)
        const username = name.split(' ')[0].toLowerCase() + index;

        stmt.run(name, kelas, jurusan, noSpp, nisn, 'siswa', username, siswaPassword);
    });

    stmt.finalize(() => {
        console.log('✅ 50 Data Siswa berhasil dibuat secara otomatis (Password: siswa123).');
        console.log('🎉 Seeding Selesai!');
        // Terminate process explicitly after successful seeding
        setTimeout(() => process.exit(0), 100);
    });
});
