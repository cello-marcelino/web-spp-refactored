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

const tarifData = [
    { jurusan: 'RPL', nominal: 500000 },
    { jurusan: 'TKJ', nominal: 450000 },
    { jurusan: 'Multimedia', nominal: 480000 },
    { jurusan: 'Akuntansi', nominal: 400000 },
    { jurusan: 'Perhotelan', nominal: 550000 },
    { jurusan: 'Tata Boga', nominal: 520000 }
];

const kelases = ['10', '11', '12'];
const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const statusList = ['success', 'success', 'success', 'pending', 'rejected'];

console.log('🔄 Memulai proses seeding data skala penuh...');

db.serialize(() => {
    // 1. Clear old data
    db.run('DELETE FROM tb_siswa');
    db.run('DELETE FROM tb_admin');
    db.run('DELETE FROM tb_tarif');
    db.run('DELETE FROM pembayaran');
    
    // reset sequence
    db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tb_siswa'");
    db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'tb_admin'");
    db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'pembayaran'");

    console.log('✅ Data lama (Siswa, Admin, Tarif, Transaksi) berhasil dibersihkan.');

    // 2. Insert Tarif Master Data
    const stmtTarif = db.prepare(`INSERT INTO tb_tarif (jurusan, nominal) VALUES (?, ?)`);
    tarifData.forEach(t => stmtTarif.run(t.jurusan, t.nominal));
    stmtTarif.finalize();
    console.log('✅ 6 Master Data Jurusan & Tarif berhasil dibuat.');

    // 3. Insert Admin
    db.run(`INSERT INTO tb_admin (nama, email, username, password, role) VALUES (?, ?, ?, ?, ?)`, 
        ['Administrator', 'admin@spp.com', 'admin', adminPassword, 'admin'], (err) => {
            if(err) console.error("❌ Error inserting admin:", err);
            else console.log("✅ Akun Admin berhasil dibuat (Username: admin | Password: admin123)");
        });

    // 4. Insert 50 Students & Dummy Payments
    const stmtSiswa = db.prepare(`INSERT INTO tb_siswa (nama_siswa, kelas, jurusan, no_spp, nisn, role, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const stmtBayar = db.prepare(`INSERT INTO pembayaran (nama_siswa, kelas, jurusan, nisn, no_spp, receipt_file, tgl_bayar, bulan_spp, nominal, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    indonesianNames.forEach((name, index) => {
        const tarifObj = tarifData[index % tarifData.length];
        const jurusan = tarifObj.jurusan;
        const kelasTingkat = kelases[index % kelases.length];
        const kelas = `${kelasTingkat} ${jurusan}`;
        const noSpp = `SPP-${1000 + index}`;
        const nisn = `2026${String(index).padStart(4, '0')}`;
        const username = name.split(' ')[0].toLowerCase() + index;

        // Create student
        stmtSiswa.run(name, kelas, jurusan, noSpp, nisn, 'siswa', username, siswaPassword);

        // Generate 1 to 4 dummy payments per student
        const numPayments = Math.floor(Math.random() * 4) + 1; 
        for(let i=0; i<numPayments; i++) {
            const bulanSpp = bulanList[Math.floor(Math.random() * bulanList.length)];
            const status = statusList[Math.floor(Math.random() * statusList.length)];
            const tglBayar = new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
            
            // Random duplicate prevention is basic, but fine for dummy data
            stmtBayar.run(name, kelas, jurusan, nisn, noSpp, 'dummy_receipt.jpg', tglBayar, bulanSpp, tarifObj.nominal, status);
        }
    });

    stmtSiswa.finalize();
    stmtBayar.finalize();
    
    console.log('✅ 50 Data Siswa berhasil diinjeksi.');
    console.log('✅ Ratusan Riwayat Transaksi SPP (Palsu) berhasil diinjeksi untuk keperluan Grafik Analitik Dasbor.');
    console.log('🎉 Seeding Selesai Total!');
    
    setTimeout(() => process.exit(0), 500);
});
